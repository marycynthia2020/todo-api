const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "../database.json");

function readDatabase(data) {
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    return data;
  } catch (error) {
    console.error(error.message);
  }
}

function writeDatabse(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data));
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
    readDatabase,
    writeDatabse
}