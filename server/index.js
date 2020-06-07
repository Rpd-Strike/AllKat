// Import packages
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

// Aplicatia
const app = express();
const TOKEN_LENGTH = 15;
const MINUTES_ONLINE = 5;
const PORT = "3000";
const CAT_FIELDS = ["availability", "name", "race", "gender", "city", "favorite_toy", "full_address", "email", "image"];

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public/"));
app.use(express.static("public/html/"));

// Own modules
const database = require("./database");
const InitScript = require('./init_script');
const LogCRUD = require("./LogCRUD");

function addIpToData(data, req)
{
  let newData = data;
  newData.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (newData.ip.substr(0, 7) == "::ffff:") {
    newData.ip = newData.ip.substr(7);
  }
  return newData;
}

function badRequest(err_description)
{
  return {status: "BAD",
          reason: err_description};
}

function validRequest(data)
{
  return {status: "OK",
          data: data}
}

function hasFields(thePObj, listFields)
{
  let valid = true;
  listFields.forEach(field => {
    if (!thePObj.hasOwnProperty(field)) {
      valid = false;
    }
  });
  return valid;
}

function generate_token(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  // console.log("Token called with " + length + " - " + result);
  return result;
}

/// =====================  User API  ======================================================

// Create User
app.post("/api/user/create", (req, res) => {
  /// add IP to the request data and check if required fields are sent
  data = addIpToData(req.body, req);
  if (!hasFields(data, ["username", "password"])) {
    return res.send(badRequest("Required fields empty"));
  }

  /// check if fields correspond to valid request
  data.password = String(data.password);
  data.username = String(data.username);
  let takenUsername = false, validPassword = (data.password.length > 0 ? true : false);
  /// === Check if username already taken
  let userList = database.readUsers();
  Object.keys(userList).forEach(username => {
    if (data.username.toLowerCase() == username.toLowerCase())
      takenUsername = true;
  });
  if (data.username.toLowerCase() == "admin") 
    return res.send(badRequest("Trying to create admin account"));
  if (data.username.toLowerCase() == "guest") 
    return res.send(badRequest("Trying to create guest account"));
  if (!validPassword || data.username.length == 0)
    return res.send(badRequest("Password or Username field invalid"));
  else if (takenUsername)
    return res.send(badRequest("Username taken"));
  
  /// Save the new user to the database
  userObj = {
    password: data.password,
    username: data.username,
    time_logged: JSON.stringify(new Date(1980, 1, 1))
  }
  userList[userObj.username] = userObj;
  database.writeUsers(userList);

  /// Log information and send back to the client data
  LogCRUD.newUser(data);
  return res.send(validRequest({info: "New user created with username: " + userObj.username}));
})

/// Login and on success generate token and send it back
app.put("/api/user/login", (req, res) => {
  data = addIpToData(req.body, req);
  if (!hasFields(data, ["username", "password"])) {
    return res.send(badRequest("Required fields empty"));
  }

  function tokenExists(tokList, checkToken) {
    return tokList.hasOwnProperty(checkToken);
  }

  /// Check if fields correspond to valid request
  data.password = String(data.password);
  data.username = String(data.username);
  let existingUsername = false, goodPassword = false;
  let userList = database.readUsers();
  Object.keys(userList).forEach(username => {
    if (data.username.toLowerCase() == username.toLowerCase()) {
      existingUsername = true;
      goodPassword = (userList[username].password == data.password);
    }
  })
  if (!existingUsername)
    return res.send(badRequest("Username doesn't exist"));
  if (!goodPassword)
    return res.send(badRequest("Password is wrong"));

  /// Generate new token and save it
  let tokenList = database.readTokens();
  let newToken = generate_token(TOKEN_LENGTH);
  while (tokenExists(tokenList, newToken)) {
    newToken = generate_token(TOKEN_LENGTH);
  }

  let newObjectToken = {
    username: data.username,
    token: newToken,
  }
  tokenList[newToken] = newObjectToken;
  database.writeTokens(tokenList);

  let newObjectUser = userList[data.username];
  newObjectUser.time_logged = JSON.stringify(new Date());
  userList[data.username] = newObjectUser;
  database.writeUsers(userList);

  /// Log info and send back request
  LogCRUD.successfullLogin(newObjectUser, data.ip);
  return res.send(validRequest({info: "Logged in and generated token is: " + newToken,
                                token: newToken}));
});


/// Logout endpoint
app.delete("/api/user/logout", (req, res) => {
  data = addIpToData(req.body, req);
  if (!hasFields(data, ["username", "token"])) {
    return res.send(badRequest("Required fields empty"));
  }

  function validUserAndToken(user, token) {
    const tokList = database.readTokens();
    if (!tokList.hasOwnProperty(token))
      return false;
    const givenUser = tokList[token].username;
    if (user != givenUser)
      return false;
    return true;
  }

  data.username = String(data.username);
  data.token = String(data.token);
  if (!validUserAndToken(data.username, data.token)) {
    return res.send(badRequest("Username and Token mismatch or invalid"));
  }

  let tokenList = database.readTokens();
  delete tokenList[data.token];
  database.writeTokens(tokenList);

  /// Log info and send back request
  LogCRUD.successfulLogout(data);
  return res.send(validRequest({info: "Logged out successfully",
                         username: data.username,
                         token: data.token}));
});

/// Get online users
app.get("/api/user/all_online", (req, res) => {
  data = addIpToData(req.body, req);
  
  function addSecondsSinceLogin(username, uList) {
    let seconds = ((new Date()) - (new Date(JSON.parse(uList[username].time_logged)))) / 1000;
    console.log("seeing that user: " + username + " is logged in for " + seconds + " seconds");
    return {time_logged: uList[username].time_logged,
            username: username,
            since_login: seconds};
  }

  const userList = database.readUsers();
  let onlineList = [];
  Object.keys(userList).forEach(username => {
    const data = addSecondsSinceLogin(username, userList);
    if (data.since_login <= MINUTES_ONLINE * 60) {
      onlineList.push(data);
    }
  });
  LogCRUD.getOnlineUsers(data, onlineList.length);
  return res.send(validRequest({info: "online user list",
                                user_list: onlineList}));
});

/// testToken
app.get("/api/user/test_token/:token", (req, res) => {
  data = addIpToData(req.body, req);
  data.token = req.params.token;
  if (!hasFields(data, ["token"]))
    return res.send(badRequest("Required field missing: token"));

  const tokenList = database.readTokens();
  LogCRUD.testToken(data.token);
  if (tokenList.hasOwnProperty(data.token)) {
    return res.send(validRequest({info: "user data",
                                  user_data: database.readUsers()[tokenList[data.token].username]}));
  }
  return res.send(badRequest("Invalid token"));
});

/// =====================  Cats API  ======================================================

function getValidAndUserFromToken(token)
{
  const tokList = database.readTokens();
  if (!hasFields(tokList, [token]))
    return {valid: false, user: ""};
  return {valid: true, user: tokList[token].username}; 
}

// Create 
app.post("/api/cat/create", (req, res) => {
  /// integrity of data
  const data = addIpToData(req.body, req);
  // console.log("Create cat with: ");
  // console.log(data);
  
  if (!hasFields(data, ["token", "cat"])) {
    return res.send(badRequest("Missing required data fields"));
  }
  if (!hasFields(data.cat, CAT_FIELDS)) {
    return res.send(badRequest("Missing cat fields"));
  }
  // console.log("Create has all fields");

  data.token = String(data.token);
  const checkObj = getValidAndUserFromToken(data.token);
  if (!checkObj.valid)
    return res.send(badRequest("Bad token"));
  // console.log("Token valid");
  
  /// generate new cat id
  let catList = database.readCats();
  let catToken = generate_token(TOKEN_LENGTH);
  while (catList.hasOwnProperty(catToken))
    catToken = generate_token(TOKEN_LENGTH);
  // console.log("Generated token");

  /// update db
  let catData = data.cat;
  catData.id = catToken;
  catList[catToken] = catData;
  database.writeCats(catList);
  // console.log("Updated database");

  /// Log and send
  LogCRUD.generateCat(data, catData.id, checkObj.username);
  res.send(validRequest({info: "Created cat",
                         id: catData.id}));
});

// Read One
app.get("/cats/:id", (req, res) => {
  const catsList = database.readCats();
  console.log("Requesting cat with ID: " + req.params.id);

  if (catsList.hasOwnProperty(req.params.id)) {
    cat = catsList[req.params.id];
    cat["id"] = req.params.id;
    console.log(cat);
    return res.send(cat);
  }
  res.status(404).send("Cat id not found");
});

// Read All
app.get("/cats", (req, res) => {
  const catsList = database.readCats();
  console.log("Get ALL cats");

  cats = {};
  Object.keys(catsList).forEach(id => {
    cat = catsList[id];
    cat["id"] = id;
    cats[id] = cat;
  });
  return res.send(cats);
});

// Update
app.put("/cats/:id", (req, res) => {
  let catsList = database.readCats();
  const id = req.params.id;
  const cat = req.body;
  if (id != cat.id) {
    res.status(404).send("Cat id's mismatch between query string and object received in PUT method");
    return ;
  }
  if (!catsList.hasOwnProperty(id)) {
    res.status(370).send("You are trying to UPDATE an inexistent cat");
    return ;
  }
  if (catsList[id].token != cat.token) {
    return res.send({"status" : "invalid", "reason" : "wrong access token"});
  }
  
  catsList[id] = cat;
  database.writeCats(catsList);
  
  console.log("Successfuly updated cat with id: " + id);
  
  return res.send({"status" : "valid"});
});

// Delete
app.delete("/cats/:id", (req, res) => {
  let catsList = database.readCats();
  const id = req.params.id;
  const cat = req.body;
  if (id != cat.id) {
    res.status(404).send("Cat id's mismatch between query string and object received in DELETE method");
    return ;
  }
  if (!catsList.hasOwnProperty(id)) {
    res.status(360).send("You are trying to DELETE an inexistent cat");
    return ;
  }
  if (catsList[id].token != cat.token) {
    return res.send({"status" : "invalid", "reason" : "wrong access token"});
  }
  delete catsList[id];
  console.log("Deleted cat with id: " + id);
  database.writeCats(catsList);
  return res.send({"status" : "valid"});
});

// Get user's cats
app.get("/api/cat/user_all", (req, res) => {
  const data = addIpToData(req.body, req);
  const catsList = database.readCats();

  res.send(validRequest("Work in progress"));
});

// creeam database
InitScript.touchDatabase();

// Pornim server-ul
app.listen(PORT, () =>
  console.log("Server started at: http://localhost:" + PORT)
);