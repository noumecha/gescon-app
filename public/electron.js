const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const mysql = require('mysql2');
//const isDev = import('electron-is-dev');

let mainWindow;

function createWindow() {
    // configure the main window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            sandbox: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: true,
            autoHideMenuBar: true,
            preload: path.join(__dirname, '../public/preload.js')
        }
    });
    
    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL(
        `http://localhost:3000`
        //`file://${path.join(__dirname, '/../build/index.html')}`
        //isDev ? `http://localhost:3000` : `file://${path.join(__dirname, '/../build/index.html')}`
    );

};

function handleSetTitle (event, title) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
}

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gescon_app_db'
}) 

function handleAddEleve (event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
    })
}

function userLogin (event, {username, password}) {
    pool.query('SELECT * FROM utilisateurs WHERE username =?', [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            if (user.nom_utilisateur === username && user.mdp_utilisateur === password) {
                event.sender.send('login-success', 'utilisateur connecté');
            } else {
                event.sender.send('login-fail',"nom d'utilisateur ou mot de passe incorrect!");
            }
        } else {
            event.reply("utilisateur non trouvé");
        }
    });
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong!');
    ipcMain.on('requete-sql', (event, arg) => {
        pool.query('SELECT * FROM personnel', (err, results) => {
            if (err) throw err;
            event.sender.send('resultat-sql', results);
        });
    });
    /*ipcMain.on('user-login', (event, {username, password}) => {
        pool.query('SELECT * FROM utilisateurs WHERE username = ?', [username, password], (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                const user = results[0];
                if (user.nom_utilisateur === username && user.mdp_utilisateur === password) {
                    event.reply("connected");
                } else {
                    event.reply("nom d'utilisateur ou mot de passe incorrect !");
                }
            } else {
                event.reply("utilisateur non trouvé");
            }
        });
    });*/
    ipcMain.on('set-title', handleSetTitle);
    ipcMain.on('user-login', userLogin);
    ipcMain.on('add-eleve', handleAddEleve);
    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})