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
    database: 'gescon_db'
}) 

// fucntion for the personnel : 
function addPersonnel(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('personnel-added-success', { message: 'Personnel ajouté avec succès !' });
    });
}
function getSpecificPersonnel(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('specific-personnel', res);
    })
}
function getPersonnel(event, arg) {
    pool.query('SELECT * FROM Personnel', (err, res) => {
        if (err) throw err;
        event.sender.send('all-personnel', res);
    });
}
function updatePersonnel(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('update-personnel-success', {message: 'Personnel mis à jour avec succès!'});
    });
}
// functions for decision : 
function getDecision(event, arg) {
    pool.query('SELECT id_decision,numero_decision,objet_decision,signataire_decision,date_decision,libelle_type_personnel FROM decision,type_personnel WHERE decision.id_type_personnel = type_personnel.id_type_personnel', (err, res) => {
        if (err) throw err;
        event.sender.send('all-decision', res);
    });
}

function getSpecificDec(event, arg) {
    pool.query('SELECT * FROM decision WHERE id_decision =?', [arg], (err, res) => {
        if (err) throw err;
        event.sender.send('specific-decision', res);
    });
}

function addDecision(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('decision-added-success', { message: 'Decision ajouté avec succès!' });
    })
}

function deleteDecision(event, req) {
    pool.query(req, (err) =>{
        if (err) throw err;
        event.sender.send('decision-deleted-success', { message: 'Decision supprimée avec succès!' });
    })
}

// functions for conge : 
function getConge(event, req) {
    pool.query('SELECT * FROM conge,personnel WHERE conge.id_personnel = personnel.id_personnel;', (err, res) => {
        if (err) throw err;
        event.sender.send('all-conge', res);
    });
}

function getAttestationConge(even, req) {
    pool.query('SELECT id_conge,nom_prenom_personnel,matricule_personnel,attestation_conge,statut_attestation_conge FROM conge,personnel WHERE conge.id_personnel = personnel.id_personnel', (err, res) => {
        if (err) throw err;
        even.sender.send('all-attestation-conge', res);
    });
}

function getSpecificConge(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('all-specific-conge', res);
    });
}

function addConge(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('conge-added-success', { message: 'Conge ajouté avec succès!' });
    })
}

function updateConge(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('update-conge-success', {message: 'Conge mis à jour avec succès!'});
    });
}

function addArchiveAttestationConge(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('attestation-conge-added-success', { message: 'Attestation de conge ajouté avec succès!' });
    })
}

function getArchiveAttConge(event, req) {
    pool.query('SELECT archive_att_conge.id_conge,id_archive_att_conge,nom_prenom_personnel,matricule_personnel,created_at_arch_att_conge,fichier_archive_att_conge FROM conge,personnel,archive_att_conge WHERE conge.id_personnel = personnel.id_personnel AND conge.id_conge = archive_att_conge.id_conge;', (err, res) => {
        if (err) throw err;
        event.sender.send('all-archived-conge', res);
    });
}

function deleteArchiveAttConge(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('delete-archive-att-conge-success', { message: 'Archive supprimée avec succès!' });
    })
}

// permission 
function getPermission(event, req) {
    pool.query('SELECT * FROM permission,personnel WHERE permission.id_personnel = personnel.id_personnel;', (err, res) => {
        if (err) throw err;
        event.sender.send('all-permission', res);
    });
}

function getAttestationPermission(even, req) {
    pool.query('SELECT id_permission,nom_prenom_personnel,matricule_personnel,attestation_permission,statut_permission,statut_attestation_permission FROM permission,personnel WHERE permission.id_personnel = personnel.id_personnel', (err, res) => {
        if (err) throw err;
        even.sender.send('all-attestation-permission', res);
    });
}

function addPermission(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('permission-added-success', { message: 'Permission ajouté avec succès!' });
    })
}

function updatePermission(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('update-permission-success', {message: 'Permission mis à jour avec succès!'});
    });
}

function addArchiveAttestationPermission(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('attestation-permission-added-success', { message: 'Attestation de conge ajouté avec succès!' });
    })
}

function getArchiveAttPermission(event, req) {
    pool.query('SELECT archive_att_permission.id_permission,id_arch_att_permission,nom_prenom_personnel,matricule_personnel,created_at_arch_permission,fichier_arch_att_permission FROM permission,personnel,archive_att_permission WHERE permission.id_personnel = personnel.id_personnel AND permission.id_permission = archive_att_permission.id_permission;', (err, res) => {
        if (err) throw err;
        event.sender.send('all-archived-permission', res);
    });
}

function deleteArchiveAttPermission(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('delete-archive-att-permission-success', { message: 'Archive supprimée avec succès!' });
    })
}

function getLastPermission(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('all-last-permission', res);
    })
}

// functions for conge type :
function getSpecificCongeType (event, arg) {
    pool.query('SELECT * FROM type_conge WHERE id_type_conge =?', [arg], (err, res) => {
        if (err) throw err;
        event.sender.send('specific-conge-type', res);
    });
}
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

// functions for document : 
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
// functions for add_users : 

function addUser(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('user-added-success', { message: 'Utilisateur ajouté avec succès!' });
    })
}
function delUser(event, r) {
    pool.query(r, (err, res) => {
        if (err) throw err;
        event.sender.send('user-deleted-success', { message: 'Utilisateur ajouté avec succès!' });
    })
}
function getUsers(event, req) {
    pool.query('SELECT * FROM utilisateur', (err, res) => {
        if (err) throw err;
        event.sender.send('all-users', res);
    })
}
function updateUser(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('user-updated-success', res);
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
    ipcMain.on('get-specific-personnel', getSpecificPersonnel);
    ipcMain.on('update-personnel', updatePersonnel);
    // decision
    ipcMain.on('get-decision', getDecision);
    ipcMain.on('add-decision', addDecision);
    ipcMain.on('delete-decision', deleteDecision);
    ipcMain.on('get-specific-decision', getSpecificDec);
    // conge type  
    ipcMain.on('get-conge-type', getCongeType);
    ipcMain.on('add-conge-type', addCongeType);
    ipcMain.on('get-specific-conge-type', getSpecificCongeType);
    // conge  
    ipcMain.on('get-specific-conge', getSpecificConge);
    ipcMain.on('get-conge', getConge);
    ipcMain.on('add-archive-attestation-conge', addArchiveAttestationConge)
    ipcMain.on('update-conge', updateConge);
    ipcMain.on('add-conge', addConge);
    ipcMain.on('get-attestation-conge', getAttestationConge);
    ipcMain.on('get-archive-att-conge', getArchiveAttConge);
    ipcMain.on('delete-archive-att-conge', deleteArchiveAttConge);
    // permission  
    ipcMain.on('get-permission', getPermission);
    ipcMain.on('get-last-permission', getLastPermission);
    ipcMain.on('add-archive-attestation-permission', addArchiveAttestationPermission)
    ipcMain.on('update-permission', updatePermission);
    ipcMain.on('add-permission', addPermission);
    ipcMain.on('get-attestation-permission', getAttestationPermission);
    ipcMain.on('get-archive-att-permission', getArchiveAttPermission);
    ipcMain.on('delete-archive-att-permission', deleteArchiveAttPermission);
    // document à fournir : 
    ipcMain.on('get-document', getDocument);
    ipcMain.on('add-document', addDocument);
    // users :
    ipcMain.on('get-users', getUsers);
    ipcMain.on('add-user', addUser);
    ipcMain.on('del-user', delUser);
    ipcMain.on('update-user', updateUser);
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