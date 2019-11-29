const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;
let addWindow;


process.env.NODE_ENV = 'production';

app.on('ready', function(){
  // Create new window
  mainWindow = new BrowserWindow({width: 950, height: 600, 
    webPreferences: {nodeIntegration: true}
  });
  // Load html in window
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  // addWindow.loadURL('http://localhost:3000');
  // Quit app when closed
  mainWindow.on('closed', function(){
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 300,
    height:200,
    title:'Add a Task',
    parent:mainWindow,
    webPreferences: {
      nodeIntegration: true
    }
  });
  addWindow.loadURL(isDev ? 'http://localhost:3000/add' : `file://${path.join(__dirname, '../build/index.html#/add')}`);
  // addWindow.loadURL('http://localhost:3000/add');
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}

// Catch item:add
ipcMain.on('task:add', function(e, item){
  mainWindow.webContents.send('task:add', item);
  addWindow.close();
});


const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'File',
    submenu:[
      {
        label:'Add Task',
        accelerator:process.platform == 'darwin' ? 'Command+A' : 'Ctrl+',
        click(){
          createAddWindow();
        }
      },
      {
        role: 'reload'
      },
      {
        label:'Clear All Tasks',
        click(){
          mainWindow.webContents.send('task:clear');
        }
      },
      {
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];

// If OSX, add empty object to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}