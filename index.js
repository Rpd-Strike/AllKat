// Import packages
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid");

const fs = require("fs");

// Aplicatia
const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public/"));
app.use(express.static("public/html/"));

// Create
app.post("/cats", (req, res) => {  
  let catsList = readJSONFile();
  /// Perform Data check HERE !!!  WARNING: TO DO
  cat = req.body;
  console.log(cat);

  catsList[cat.id] = cat;
  writeJSONFile(catsList);

  response = {
    "status" : "Valid or Invalid"
  };

  res.send(response);
});

// Read One
app.get("/cats/:id", (req, res) => {
  const catsList = readJSONFile();
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
  const catsList = readJSONFile();
  console.log(catsList);

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
  let catsList = readJSONFile();
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
    res.status(370).send("Wrong token access for the cat with id: " + id);
    return ;
  }
  
  catsList[id] = cat;
  writeJSONFile(catsList);
  
  console.log("Successfuly updated cat with id: " + id);
  
  res.send({"status" : "valid"});
});

// Delete
app.delete("/cats/:id", (req, res) => {
  let catsList = readJSONFile();
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
    res.status(360).send("Wrong token access to DELETE the cat with id: " + id);
    return ;
  }
  delete catsList[id];
  console.log("Deleted cat with id: " + id);
});

// Functia de citire din fisierul db.json
function readJSONFile() {
  let meh = JSON.parse(fs.readFileSync("db.json"));
  return meh["cats"];
}

// Functia de scriere in fisierul db.json
function writeJSONFile(content) {
  fs.writeFileSync(
    "db.json",
    JSON.stringify({ cats: content }),
    "utf8",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
}

// Pornim server-ul
app.listen("3000", () =>
  console.log("Server started at: http://localhost:3000")
);