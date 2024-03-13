const crypto = require('crypto-browserify');
global.crypto = crypto;
let mysql = require('mysql2')

// configuration de mysql     
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gesnotes"
})
/*con.connect((err) => {
    if (err) {
        console.log("Erreur de connection : " + err)
    } else {
        console.log("Connecté à la base de donnée !")
    }
});*/

module.exports = {con, mysql}