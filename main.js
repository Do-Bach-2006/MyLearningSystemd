// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  webContents,
  dialog,
  BrowserView,
} = require("electron");
const path = require("node:path");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      enableRemoteModule: true,
      webviewTag: true, // Enable webview
      nodeIntegration: true, // Enable Node.js in the renderer process
      contextIsolation: false, // Disable context isolation
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.openDevTools();
  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  // set up event listener for 'get-user-data-path'
  ipcMain.handle("get-user-data-path", () => app.getPath("userData"));
  // set up the event listener for 'get-temp-dir'
  ipcMain.handle("get-temp-dir", () => app.getPath("temp"));
  // set up the event listener for 'select-directory'
  // this will allow user to select a directory
  ipcMain.handle("select-directory", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    return result.filePaths[0]; // Return the selected directory path
  });
});
