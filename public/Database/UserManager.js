const dmgr = require('./DBManager');
const db = dmgr.db;

const readAllUsers = () => {
    try {
        const q = `SELECT * FROM utilisateur;`;
        const readQuery = db.prepare(q);
        const rowList = readQuery.all();
        return rowList;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const insertUsers = (
    nom_u, 
    email_u, 
    telephone_u, 
    mdp_u, 
    role_u) => {
        try {
            const insertQuery = db.prepare(`INSERT INTO utilisateur (
                nom_utilisateur, 
                email_utilisateur, 
                telephone_utilisateur,
                mdp_utilisateur,
                role_utilisateur) VALUES ('${nom_u}', '${email_u}', '${telephone_u}', '${mdp_u}', '${role_u}',)`);
            const transaction = db.transaction(() => {
                const info = insertQuery.run();
                console.log(`Inserted ${info.changes} rows with last ID ${info.lastInsertRowid} into utilisateur`);
            });
        } catch (err) {
            console.error(err);
            throw err;
        }
}

module.exports = {
    readAllUsers,
    insertUsers
}