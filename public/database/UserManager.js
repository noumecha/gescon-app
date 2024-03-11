const dbmgr = require("./DBManager");
const db = dbmgr.db;

const readAllUsers = () => {
    try {
        const query = "SELECT * FROM utilisateur";
        const readQuery = db.prepare(query);
        const rowList = readQuery.all();
        return rowList;
    } catch (err) {
        console.error("erreur de lecture : " ,err);
        throw err;
    }
}

const insertUser = (name, age) => {
    try {
        const insertQuery = db.prepare(`INSERT INTO utilisateur (name, age) VALUES ('${name}', '${age}')`);
        const transaction = db.transaction(() => {
            const info = insertQuery.run()
            console.log(
                `Insertion de ${info.changes} ligne avec le dernier ID ${info.lastInsertRowid} dans la tale utilisateur `
            );
        })
        transaction();
    } catch (err) {
        console.error("erreur d'insertion : ",err);
        throw err;
    }
}

module.exports = {
    readAllUsers,
    insertUser
}