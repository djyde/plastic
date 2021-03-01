const { app, BrowserWindow } = require("electron");
// require('./menu')
const DB = require('./db')
const isDev = require("electron-is-dev");
const path = require("path")

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 1280 * 0.6,
    minWidth: 1280,
    minHeight: 1280 * 0.6,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:3000");
  } else {
    win.loadFile(path.resolve(__dirname, './dist/index.html'))
  }

  return win;
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("open-file", (e, path) => {
  e.preventDefault();
  const win = createWindow();
  win.setRepresentedFilename(path);
  DB.openDirectoryOnWindow(path, win.id)
});

exports.createWindow;
