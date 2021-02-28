const { app, BrowserWindow } = require("electron");
// require('./menu')
const DB = require('./db')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  if (process.env.NODE_ENV !== "production") {
    win.loadURL("http://localhost:3000");
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
