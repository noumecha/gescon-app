const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.NODE_ENV === 'development' 
    ? "../gescon_app.db" 
    : path.join(process.resourcesPath, "../gescon_app.db");

const db = new Database(dbPath);
db.pragma("journal_node = WAL")

exports.db = db;