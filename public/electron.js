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

/*function handleAddEleve (event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        console.log('eleve added');
    })
}*/
// fucntion for the personnel : 
function addPersonnel(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('personnel-added-success', { message: 'Personnel ajouté avec succès !' });
    })
}
function getPersonnel(event, arg) {
    pool.query('SELECT * FROM Personnel', (err, res) => {
        if (err) throw err;
        event.sender.send('all-personnel', JSON.stringify(res));
    });
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong!');
    ipcMain.on('requete-sql', (event, arg) => {
        pool.query('SELECT * FROM personnel', (err, results) => {
            if (err) throw err;
            event.sender.send('resultat-sql', JSON.stringify(results));
        });
    });
    ipcMain.on('add-personnel', addPersonnel);
    ipcMain.on('get-personnel', getPersonnel);
    /*ipcMain.on('get-personnel', (event, args) => {
        pool.query('SELECT * FROM personnel', (err, data) => {
            if (err) throw err;
            event.sender.send('all-personnel', JSON.stringify(data));
        });
    });*/
    ipcMain.on('set-title', handleSetTitle);
    //ipcMain.on('add-eleve', handleAddEleve);
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