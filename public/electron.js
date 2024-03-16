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

function handleData () {
    // Connection à la base de données MySQL
    return new Promise ((resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gesnotes'
        });
        connection.connect();
        const sql = 'SELECT * FROM eleve';
        connection.query(sql, (error, results) => {
            if (error) {
                console.error('eleves-result', { success: false, error: error.message });
                reject(error);
            } else {
                console.log('eleves-result', { success: true, data: results });
                resolve(JSON.stringify(results));
            }
        });
    });
}

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gesnotes'
}) 

function handleAddEleve (event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
    })
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong!');
    ipcMain.handle('sql', () => handleData);  
    ipcMain.on('requete-sql', (event, arg) => {
        pool.query('SELECT * FROM eleve', (err, results) => {
            if (err) throw err;
            event.sender.send('resultat-sql', JSON.stringify(results));
        });
    });
    ipcMain.on('set-title', handleSetTitle);
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