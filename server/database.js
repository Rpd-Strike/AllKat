const fs = require('fs');

// Functia de citire din fisierul db.json
function readJSONFile(filename) {
  let meh = JSON.parse(fs.readFileSync(filename));
  return meh;
}

// Functia de scriere in fisierul db.json
function writeJSONFile(content, filename) {
  fs.writeFileSync(
    filename,
    JSON.stringify(content, null, 2),
    "utf8",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
}

module.exports = {
  readCats: function()
  {
    return readJSONFile("db/cats.json");
  },

  writeCats: function(content) {
    writeJSONFile(content, "db/cats.json");
  },

  readTokens: function()
  {
    return readJSONFile("db/tokens.json");
  },

  writeTokens: function(content) {
    writeJSONFile(content, "db/tokens.json");
  },

  readUsers: function()
  {
    return readJSONFile("db/users.json");
  },

  writeUsers: function(content) {
    writeJSONFile(content, "db/users.json");
  }
}