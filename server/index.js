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
const CAT_FIELDS = ["name", "race", "gender", "city", "favorite_toy", "full_address", "email", "image"];
const GENESIS_DATE = new Date(1980, 1, 1);

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
  // console.log("validRequest data:");
  // console.log(data);
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

function getValidAndUserFromToken(token)
{
  const tokList = database.readTokens();
  if (!hasFields(tokList, [token]))
    return {valid: false, user: ""};
  return {valid: true, user: tokList[token].username}; 
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
    blocked: false,
    time_logged: JSON.stringify(GENESIS_DATE),
    second_last_login: JSON.stringify(GENESIS_DATE),
    time_logout: JSON.stringify(GENESIS_DATE),
    last_ip: "0.0.0.0",
    second_last_ip: "0.0.0.0",
    nr_visits: 0
  }
  userList[userObj.username.toLowerCase()] = userObj;
  database.writeUsers(userList);

  /// Log information and send back to the client data
  LogCRUD.newUser(data);
  res.send(validRequest({info: "New user created with username: " + userObj.username}));
})

/// Login and on success generate token and send it back
app.put("/api/user/login", (req, res) => {
  let data = addIpToData(req.body, req);
  if (!hasFields(data, ["username", "password"])) {
    return res.send(badRequest("Required fields empty"));
  }

  function tokenExists(tokList, checkToken) {
    return tokList.hasOwnProperty(checkToken);
  }

  /// Check if fields correspond to valid request
  data.password = String(data.password);
  data.username = String(data.username).toLowerCase();
  let existingUsername = false, goodPassword = false, isUserBlocked = false;
  let userList = database.readUsers();
  Object.keys(userList).forEach(username => {
    if (data.username.toLowerCase() == username.toLowerCase()) {
      existingUsername = true;
      goodPassword = (userList[username].password == data.password);
      isUserBlocked = userList[username].blocked;
    }
  })
  if (!existingUsername)
    return res.send(badRequest("Username doesn't exist"));
  if (!goodPassword)
    return res.send(badRequest("Password is wrong"));
  if (isUserBlocked)
    return res.send(badRequest("User is Blocked!"));

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
  // let lastDate = new Date(JSON.parse(newObjectUser.time_logged));
  // console.log(newObjectUser);
  // if (lastDate.getFullYear() > 2000) {
  //   console.log("CASCADING DATE LOGIN");
  //   newObjectUser.second_last_login = newObjectUser.time_logged;
  // }
  newObjectUser.second_last_login = newObjectUser.time_logged;
  newObjectUser.time_logged = JSON.stringify(new Date());
  newObjectUser.second_last_ip = newObjectUser.last_ip;
  newObjectUser.last_ip = data.ip;
  newObjectUser.nr_visits += 1;
  userList[data.username] = newObjectUser;
  // console.log("after mod");
  // console.log(newObjectUser);
  database.writeUsers(userList);

  /// Log info and send back request
  LogCRUD.successfullLogin(newObjectUser, data.ip);
  res.send(validRequest({info: "Logged in and generated token is: " + newToken,
                         token: newToken,
                         user: userList[data.username].username}));
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

  data.username = String(data.username).toLowerCase();
  data.token = String(data.token);
  if (!validUserAndToken(data.username, data.token)) {
    return res.send(badRequest("Username and Token mismatch or invalid"));
  }

  /// mark time_logged old date;
  let userDB = database.readUsers();
  userDB[data.username].time_logout = JSON.stringify(new Date());
  database.writeUsers(userDB);

  let tokenList = database.readTokens();
  delete tokenList[data.token];
  database.writeTokens(tokenList);

  /// Log info and send back request
  LogCRUD.successfulLogout(data);
  res.send(validRequest({info: "Logged out successfully",
                         username: data.username,
                         token: data.token}));
});

/// Get online users
app.get("/api/user/all_online", (req, res) => {
  data = addIpToData(req.body, req);
  
  function addSecondsSinceLogin(username, uList) {
    let seconds = ((new Date()) - (new Date(JSON.parse(uList[username].time_logged)))) / 1000;
    // console.log("seeing that user: " + username + " is logged in for " + seconds + " seconds");
    return {time_logged: uList[username].time_logged,
            username: username,
            since_login: seconds};
  }

  const userList = database.readUsers();
  let onlineList = [];
  Object.keys(userList).forEach(username => {
    const data = addSecondsSinceLogin(username, userList);
    const logout_date = new Date(JSON.parse(userList[username].time_logout));
    const time_since_logout = (new Date() - logout_date) / 1000;
    console.log("Time: " + username + " | " + data.since_login + " | " + time_since_logout);
    if (data.since_login <= MINUTES_ONLINE * 60) {
      if (time_since_logout >= data.since_login) {
        onlineList.push(data);
        console.log("OK");
      }
    }
  });
  LogCRUD.getOnlineUsers(data, onlineList.length);
  res.send(validRequest({info: "online user list",
                                user_list: onlineList}));
});

/// testToken
app.get("/api/user/test_token/:token", (req, res) => {
  data = addIpToData(req.body, req);
  data.token = req.params.token;
  if (!hasFields(data, ["token"]))
    return res.send(badRequest("Required field missing: token"));

  const tokenList = database.readTokens();
  LogCRUD.testToken(data);
  if (tokenList.hasOwnProperty(data.token)) {
    let sentUser = database.readUsers()[tokenList[data.token].username.toLowerCase()];
    delete sentUser.password;
    // console.log("OK TOKEN");
    return res.send(validRequest({info: "user data",
                                  user_data: sentUser}));
  }
  res.send(badRequest("Invalid token"));
});

/// === Admin API =======

app.delete("/api/admin", (req, res) => {
  const data = addIpToData(req.body, req);
  if (!hasFields(data, ["token", "user"]))
    return res.send(badRequest("Missing required fields"));

  data.user = String(data.user.toLowerCase());

  userData = getValidAndUserFromToken(data.token);
  if (!userData.valid)
    return res.send(badRequest("Bad Token"));
  if (userData.user.toLowerCase() != "admin")
    return res.send(badRequest("You are not admin"));
  
  let userList = database.readUsers();
  if (!userList.hasOwnProperty(data.user.toLowerCase()))
    return res.send(badRequest("Inexistent user"));
  
  /// delete all its tokens
  let tokenList = database.readTokens();
  Object.keys(tokenList).forEach(tok => {
    if (tokenList[tok].username.toLowerCase() == data.user.toLowerCase()) {
      delete tokenList[tok];
    }
  });
  database.writeTokens(tokenList);

  delete userList[data.user];
  database.writeUsers(userList);
  LogCRUD.deleteUser(data);
  
  res.send(validRequest({info: "Deleted user",
                         deleted_user: data.user}));
});

app.put("/api/admin/block", (req, res) => {
  const data = addIpToData(req.body, req);
  console.log("Received data:");
  console.log(data);
  if (!hasFields(data, ["token", "user", "status"]))
    return res.send(badRequest("Missing required fields"));
  data.user = data.user.toLowerCase();

  const userData = getValidAndUserFromToken(data.token);
  if (!userData.valid)
    return res.send(badRequest("Bad Token"));
  if (userData.user.toLowerCase() != "admin")
    return res.send(badRequest("You are not admin"));

  let userList = database.readUsers();
  if (!userList.hasOwnProperty(data.user))
    return res.send(badRequest("Inexistent user"));

  if (data.status == true) {
    // first, you cant block the admin
    if (data.user.toLowerCase() == 'admin')
      return res.send(badRequest("You can't block the admin"));
    // delete tokens if he's getting blocked
    let tokenList = database.readTokens();
    Object.keys(tokenList).forEach(tok => {
      if (tokenList[tok].username.toLowerCase() == data.user.toLowerCase()) {
        delete tokenList[tok];
      }
    });
    database.writeTokens(tokenList);
  }

  userList[data.user].blocked = (data.status == true);
  database.writeUsers(userList);

  LogCRUD.blockUser(data);
  res.send(validRequest({info: "Block/Unblock user",
                         user: data.user,
                         status: userList[data.user].blocked}));
});

app.put("/api/admin/reset", (req, res) => {
  const data = addIpToData(req.body, req);
  if (!hasFields(data, ["token", "user", "password"]))
    return res.send(badRequest("Missing required fields"));
  data.user = data.user.toLowerCase();

  const userData = getValidAndUserFromToken(data.token);
  if (!userData.valid)
    return res.send(badRequest("Bad Token"));
  if (userData.user.toLowerCase() != "admin")
    return res.send(badRequest("You are not admin"));

  let userList = database.readUsers();
  if (!userList.hasOwnProperty(data.user))
    return res.send(badRequest("Inexistent user"));
  if (data.password.length < 1)
    return res.send(badRequest("Password has length 0"));

  userList[data.user].password = data.password;
  database.writeUsers(userList);

  LogCRUD.resetUser(data);
  res.send(validRequest({info: "Reset Password",
                         user: data.user}));
});

app.get("/api/admin/all/:token", (req, res) => {
  const data = addIpToData(req.body, req);
  data.token = req.params.token;
  if (!hasFields(data, ["token"]))
    return res.send(badRequest("Missing required fields"));

  const userData = getValidAndUserFromToken(data.token);
  if (!userData.valid)
    return res.send(badRequest("Bad Token"));
  if (userData.user.toLowerCase() != "admin")
    return res.send(badRequest("You are not admin"));

  const userList = database.readUsers();

  LogCRUD.getAllUsers(data);
  res.send(validRequest({info: "List of all users",
                         user_list: userList}));
});

/// =====================  Cats API  ======================================================

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
  if (checkObj.user.toLowerCase() == "guest")
    return res.send(badRequest("Guest can not create cats"));
  // console.log("Token valid");
  checkObj.user = database.readUsers()[checkObj.user.toLowerCase()].username;
  
  /// generate new cat id
  let catList = database.readCats();
  let catToken = generate_token(TOKEN_LENGTH);
  while (catList.hasOwnProperty(catToken))
    catToken = generate_token(TOKEN_LENGTH);
  // console.log("Generated cat id_token");

  // add User Owner and numar vizualizari
  let catData = data.cat;
  catData.user = checkObj.user;
  catData.nr_viz = 0;
  catData.availability = "free";
 
  /// add token and write to db
  catData.id = catToken;
  catList[catToken] = catData;
  database.writeCats(catList);
  // console.log("Updated database");

  /// Log and send
  LogCRUD.generateCat(data, checkObj.user);
  res.send(validRequest({info: "Created cat",
                         id: catData.id}));
});

// Read One
app.get("/api/cat/single/:id", (req, res) => {
  let data = addIpToData(req.body, req);
  data = {id: req.params.id};

  const catsList = database.readCats();

  if (catsList.hasOwnProperty(data.id)) {
    cat = catsList[data.id];
    cat["id"] = data.id;
    LogCRUD.getSingleCat(data, cat);
    return res.send(validRequest({info: "Received cat",
                                  cat: cat}));
  }
  res.send(badRequest("Bad Cat ID"));
});

// Read All
app.get("/api/cat/all", (req, res) => {
  const data = addIpToData(req.body, req);
  const catsList = database.readCats();
  console.log("Get ALL cats");

  cats = {};
  Object.keys(catsList).forEach(id => {
    cat = catsList[id];
    cat.id = id;
    cats[id] = cat;
  });

  LogCRUD.getAllCats(data);
  res.send(validRequest({info: "List having all cats",
                   cat_list: cats}));
});

// Update
app.put("/api/cat/:id", (req, res) => {
  const data = addIpToData(req.body, req);
  if (!hasFields(data, ["token", "cat"]))
    return res.send(badRequest("Empty required fields"));
  if (!hasFields(data.cat, CAT_FIELDS))
    return res.send(badRequest("Cat object has missing fields"));

  let catsList = database.readCats();
  if (req.params.id != data.cat.id) {
    res.send(badRequest("Cat id's mismatch between query string and object received in PUT method"));
    return ;
  }
  if (!catsList.hasOwnProperty(data.cat.id)) {
    res.send(badRequest("You are trying to UPDATE an inexistent cat"));
    return ;
  }
  
  checkObj = getValidAndUserFromToken(data.token);
  if (!checkObj.valid)
    return res.send(badRequest("Bad Token"));
  if (checkObj.user.toLowerCase() != catsList[data.cat.id].user 
      && checkObj.user.toLowerCase() != "admin")
    return res.send(badRequest("Bad Token (Bad User)"))
  
  /// the two fields that the user can't change, only the server
  data.cat.user = checkObj.user;
  data.cat.nr_viz = catsList[data.cat.id].nr_viz;

  /// updating cat and saving to DB
  catsList[data.cat.id] = data.cat;
  database.writeCats(catsList);
  
  LogCRUD.updatedCat(data, checkObj.user);  //// TODO add username here
  res.send(validRequest({info: "Updated cat",
                                cat: data.cat}));
});

// Delete
app.delete("/api/cat/single/delete", (req, res) => {
  const data = addIpToData(req.body, req);
  if (!hasFields(data, ["token", "id"]))
    return res.send(badRequest("Missing required fields"));

  /// find if cat actually exists
  let catsList = database.readCats();
  if (!catsList.hasOwnProperty(data.id)) {
    res.send(badRequest("You are trying to DELETE an inexistent cat"));
    return ;
  }

  /// check validity of token
  const checkData = getValidAndUserFromToken(data.token);
  if (!checkData.valid)
    return res.send(badRequest("Invalid token"));
  
  /// check ownership
  if (catsList[data.id].user != checkData.user
      && checkData.user != "admin")
    return res.send(badRequest("You do not have ownership of this cat"));
  
  /// Delete and log
  delete catsList[data.id];
  database.writeCats(catsList);

  LogCRUD.deleteCat(data, checkData.user);
  res.send(validRequest({info: "Deleted cat",
                         id: data.id}));  
});

// Get user's cats
app.get("/api/cat/user_all/:token", (req, res) => {
  let data = addIpToData(req.body, req);
  const catsList = database.readCats();
  data.token = req.params.token;

  const checkData = getValidAndUserFromToken(data.token);
  if (!checkData.valid)
    return res.send(badRequest("Invalid token"));
  
  if (checkData.user.toLowerCase() == "admin") {
    LogCRUD.getUserCats(checkData.user, data, Object.keys(catsList).length);
    return res.send(validRequest({info: "List with all the cats user has access to",
                                  cat_list: catsList}));
  }

  responseCatList = {};
  Object.keys(catsList).forEach(id => {
    if (catsList[id].user.toLowerCase() == checkData.user.toLowerCase())
      responseCatList[id] = catsList[id];
  });
  LogCRUD.getUserCats(checkData.user, data, Object.keys(responseCatList).length);

  res.send(validRequest({info: "List with all the cats user has access to",
                         cat_list: responseCatList}));
});

/// Add One view to cat
app.put("/api/cat/view/:catId", (req, res) => {
  const data = addIpToData(req.body, req);
  const catId = req.params.catId;

  let catList = database.readCats();
  if (!catList.hasOwnProperty(catId))
    return res.send(badRequest("Cat Token non-existent"));
  
  catList[catId].nr_viz += 1;
  LogCRUD.addView(catList[catId], data.ip);
  database.writeCats(catList);

  res.send(validRequest({info: "Added view",
                         catId: catId}));
});

// creeam database
InitScript.touchDatabase();
InitScript.touchLogs();

// Pornim server-ul
app.listen(PORT, () =>
  console.log("Server started at: http://localhost:" + PORT)
);