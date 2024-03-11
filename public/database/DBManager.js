//const path = import('path');
const Database = require("better-sqlite3");

const dbPath = "../gescon_app.db";

/*const dbPath = process.env.NODE_ENV === "development" 
    ? "../gescon_app.db" 
    : path.join(process.ressourcePath, "../gescon_app.db");*/

const db = new Database(dbPath);
db.pragma("journal_node = WAL");

exports.db = db;