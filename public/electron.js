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
        //`file://${path.join(__dirname, '../build/index.html')}`
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
        event.sender.send('all-personnel', res);
    });
}

// function for decision : 
function getDecision(event, arg) {
    pool.query('SELECT * FROM decision', (err, res) => {
        if (err) throw err;
        event.sender.send('all-decision', res);
    });
}

function addDecision(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('decision-added-success', { message: 'Decision ajouté avec succès!' });
    })
}

// function for conge : 
function getConge(event, req) {
    pool.query('SELECT * FROM conge', (err, res) => {
        if (err) throw err;
        event.sender.send('all-conge', res);
    });
}

function addConge(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('conge-added-success', { message: 'Conge ajouté avec succès!' });
    })
}

// function for conge type :
function getCongeType(event, res) {
    pool.query('SELECT * FROM type_conge', (err, res) => {
        if (err) throw err;
        event.sender.send('all-conge-type', res);
    });
}

function addCongeType(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('conge-type-added-success', { message: 'Type de conge ajouté avec succès!' });
    });
}

// for demandes :
function addDemande(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('demande-added-success', { message: 'Demande ajouté avec succès!' });
    });
}
function getDemande(event, req) {
    pool.query('SELECT * FROM demande', (err, res) => {
        if (err) throw err;
        event.sender.send('all-demande', res);
    });
}
// for document : 
function addDocument(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('document-added-success', { message: 'Document ajouté avec succès!' });
    });
}
function getDocument(event, req) {
    pool.query('SELECT * FROM doc_a_fournir', (err, res) => {
        if (err) throw err;
        event.sender.send('all-document', res);
    });
}
// function for add_users : 

function addUser(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('user-added-success', { message: 'Utilisateur ajouté avec succès!' });
    })
}

function getUsers(event, req) {
    pool.query('SELECT * FROM utilisateur WHERE', (err, res) => {
        if (err) throw err;
        event.sender.send('all-users', res);
    })
}

/**
 * In this following code is the main 
 * code when the app is started
 */
app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong!');
    // personnel datas get
    ipcMain.on('requete-sql', (event, arg) => {
        pool.query('SELECT * FROM personnel', (err, results) => {
            if (err) throw err;
            event.sender.send('resultat-sql', JSON.stringify(results));
        });
    });
    ipcMain.on('add-personnel', addPersonnel);
    ipcMain.on('get-personnel', getPersonnel);
    // decision data get : 
    ipcMain.on('get-decision', getDecision);
    ipcMain.on('add-decision', addDecision);
    // conge type data get : 
    ipcMain.on('get-conge-type', getCongeType);
    ipcMain.on('add-conge-type', addCongeType);
    // conge data get : 
    ipcMain.on('get-conge', getConge);
    ipcMain.on('add-conge', addConge);
    // demande data get :
    ipcMain.on('get-demande', getDemande);
    ipcMain.on('add-demande', addDemande);
    // document à fournir : 
    ipcMain.on('get-document', getDocument);
    ipcMain.on('add-document', addDocument);
    // for users :
    ipcMain.on('get-users', getUsers);
    ipcMain.on('add-user', addUser);
    // set the App title
    ipcMain.on('set-title', handleSetTitle);
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