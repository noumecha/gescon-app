const { contextBridge } = require("electron");
const usersDB = require("./Database/UserManager.js");

contextBridge.exposeInMainWorld("sqlite", {
    usersDB,
})

