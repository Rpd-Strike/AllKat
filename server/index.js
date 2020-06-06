// Import packages
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

// Aplicatia
const app = express();
const PORT = 3000;

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public/"));
app.use(express.static("public/html/"));

// Own modules
const database = require("./database");
const InitScript = require('./init_script');

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
app.listen(PORT, () =>
  console.log("Server started at: http://localhost:" + PORT)
);