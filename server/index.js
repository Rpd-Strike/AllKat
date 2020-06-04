// Import packages
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid");

const fs = require("fs");

// Aplicatia
const app = express();
const TOKEN_LENGTH = 15;

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public/"));
app.use(express.static("public/html/"));

// Own modules
const database = require("./database");
const InitScript = require('./init_script');

function addIpToData(data, req)
{
  let newData = data;
  newData.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  return newData;
}

// User API =============
// Create User
app.post("/api/user/create", (req, res) => {
  /// add IP to the request data and check if required fields are sent
  data = addIpToData(req.body, req);
  if (!hasFields(data, ["username", "password"])) {
    res.send(badRequest("Required fields empty"));
  }

  /// check if fields correspond to valid request
  data.password = String(password);
  data.username = String(username);
  let takenUsername = false, validPassword = (data.password.length > 0 ? true : false);
  /// === Check if username already taken
  let userList = database.readUsers();
  userList.forEach(username => {
    if (data.username.toLowerCase() == username.toLowerCase())
      takenUsername = true;
  });
  if (!validPassword || data.username.length == 0)
    res.send(badRequest("Password or Username field invalid"));
  else if (takenUsername)
    res.send(badRequest("Username taken"));
  
  /// Save the new user to the database
  userObj = {
    password: data.password,
    username: data.username
  }
  userList[userObj.username] = userObj;
  database.writeUsers(userList);

  /// Log information and send back to the client data
  LogNewUser(data);
  res.send(validRequest({info: "New user created with username: " + userObj.username}));
})

/// Login and on success generate token and send it back
app.put("/api/user/login", (req, res) => {
  data = addIpToData(req.body, req);
  if (!hasFields(data, ["username", "password"])) {
    res.send(badRequest("Required fields empty"));
  }

  function generate_token(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log("Token called with " + length + " - " + result);
    return result;
  }

  /// Check if fields correspond to valid request
  data.password = String(password);
  data.username = String(username);
  let existingUsername = false, goodPassword = false;
  const userList = database.readUsers();
  userList.forEach(username => {
    if (data.username.toLowerCase() == username.toLowerCase()) {
      existingUsername = true;
      goodPassword = (userList[username].password == data.password);
    }
  })
  if (!existingUsername)
    res.send(badRequest("Username doesn't exist"));
  if (!goodPassword)
    res.send(badRequest("Password is wrong"));

  /// Generate new token and save it
  let tokenList = database.readTokens();
  let newToken = generate_token(TOKEN_LENGTH);
  while (tokenExists(tokenList, newToken)) {
    newToken = generate_token(TOKEN_LENGTH);
  }

  let newObject = {
    username: data.username,
    token: newToken
  }
  tokenList[newToken] = newObject;
  database.writeTokens(tokenList);

  /// Log info and send back request
  LogSuccessfullLogin(newObject);
  res.send(validRequest({info: "Logged in and generated token is: " + newToken}));
});


/// Logout endpoint
app.delete("/api/user/logout", (req, res) => {
  data = addIpToData(req.body, req);
  if (!hasFields(data, ["username", "token"])) {
    res.send(badRequest("Required fields empty"));
  }

  data.username = String(data.username);
  data.token = String(data.token);
  if (!validUserAndToken(data.username, data.token)) {
    res.send(badRequest("Username and Token mismatch or invalid"));
  }

  let tokenList = database.readTokens();
  delete tokenList[data.token];
  database.writeTokens(tokenList);

  /// Log info and send back request
  LogSuccessfulLogout(data);
  res.send(validRequest({info: "Logged out successfully",
                         username: data.username,
                         token: data.token}));
})

/// Get Online users  || WORK IN PROGERSS
app.get("/api/user/all_online", (req, res) => {
  data = addIpToData(req.body, req);
  
  const userList = database.readUsers();
  userList.forEach(username => {
    
  });
})

// Create
app.post("/cats", (req, res) => {  
  let catsList = database.readCats();
  cat = req.body;
  console.log(cat);

  catsList[cat.id] = cat;
  database.writeCats(catsList);

  response = {
    "status" : "Valid or Invalid"
  };

  res.send(response);
});

// Read One
app.get("/cats/:id", (req, res) => {
  const catsList = database.readCats();
  console.log("Requesting cat with ID: " + req.params.id);

  if (catsList.hasOwnProperty(req.params.id)) {
    cat = catsList[req.params.id];
    cat["id"] = req.params.id;
    console.log(cat);
    res.send(cat);
    return ;
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
  res.send(cats);
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
    res.send({"status" : "invalid", "reason" : "wrong access token"});
    return ;
  }
  
  catsList[id] = cat;
  database.writeCats(catsList);
  
  console.log("Successfuly updated cat with id: " + id);
  
  res.send({"status" : "valid"});
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
    res.send({"status" : "invalid", "reason" : "wrong access token"});
    return ;
  }
  delete catsList[id];
  console.log("Deleted cat with id: " + id);
  database.writeCats(catsList);
  res.send({"status" : "valid"});
});

// creeam database
InitScript.touchDatabase();

// Pornim server-ul
app.listen("3000", () =>
  console.log("Server started at: http://localhost:3000")
);