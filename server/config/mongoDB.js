require("dotenv").config();

const { MongoClient } = require("mongodb");

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

// Database Name
const dbName = "db_ch1_sosmed_app";
let db;

async function mongoConnect() {
  try {
    await client.connect();
    console.log("Connected successfully to mongodb");

    db = client.db(dbName);

    return db;
  } catch (error) {
    await client.close();
  }
}

function getDatabase() {
  return db;
}

module.exports = {
  mongoConnect,
  db,
  getDatabase,
};
