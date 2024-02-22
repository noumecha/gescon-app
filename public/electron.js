// import required modules
import isDev from 'electron-is-dev';
import path from 'path';
import { app, BrowserWindow } from 'electron';
//const path = require('path');
//const { app, BrowserWindow } = require('electron');
//const isDev = require('electron-is-dev');

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
app.whenReady().then(createWindow);

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