const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app, BrowserWindow } = require('electron');
const isDev = import('electron-is-dev');

// creation de la base de données dans le dossier de l'application
const dbPath = path.join(__dirname, '../gescon-db.db');
const db = new sqlite3.Database(dbPath);

// create users table 
db.run(
    `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password TEXT NOT NULL)`
);

// initialize main window var
let mainWindow;

// function to create the main window
const createWindow = () => {
    // configure the main window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            autoHideMenuBar: true,
        }
    });
    
    // hide the menu bar
    mainWindow.setMenuBarVisibility(false);

    // load the appropriate URL based on the env
    mainWindow.loadURL(
        isDev
          ? `http://localhost:3000` // dev url
            : `file://${path.join(__dirname, '../build/index.html')}` // prod url
    );

    // opent dev tools in dev mode
    if(isDev) {
        mainWindow.webContents.openDevTools({mode: 'detached'});
    }
};

// create the main window when the app is ready
//app.whenReady().then(createWindow);

// add user to the db 
app.on('ready', () => {
    const testUser = { username: 'user', password: 'password' };

    db.run('INSERT INTO user (username, password) VALUES (?, ?)', [testUser.username,testUser.password], (err) => {
        if(err) {
            console.error(err.message);
        } else {
            console.log('Utilisateur ' + testUser.username + ' ajouter à la base de données');
        }
    });

    createWindow();
} )

// quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    app.quit();
})

// create a new window when the app is activated (macOS)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})