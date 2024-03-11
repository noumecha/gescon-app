const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
//const isDev = import('electron-is-dev');

let mainWindow;

const createWindow = () => {
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

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong!');
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