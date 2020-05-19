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
  if (catsList.hasOwnProperty(req.params.id)) {
    cat = catsList[req.params.id];
    cat["id"] = catsList[req.params.id];
    res.send(cat);
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
  const catsList = readJSONFile();
  /// TO DO
});

// Delete
app.delete("/cats/:id", (req, res) => {
  const catsList = readJSONFile();
  const id = req.params.id;
  /// TO DO
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