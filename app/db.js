const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { nanoid } = require("nanoid");
const { ipcMain: ipc } = require('electron-better-ipc')
const dayjs = require('dayjs')

class DB {

  db

  init() {
    const dbFilePath = "db.json";

    const adapter = new FileSync(dbFilePath);
    this.db = low(adapter);

    this.db.defaults({
      pages: [],
    }).write();
  }

  createPage(pageTitle, meta = {}) {
    return this.db.get('pages').push({
      title: pageTitle,
      id: nanoid(8),
      ...meta,
      children: [
        {
          id: nanoid(8),
          content: '',
          children: []
        }
      ]
    })
    .write()
  }

  updatePage(pageId, children) {
    return this.db.get("pages")
      .find({ id: pageId })
      .assign({
        children,
      })
      .write();
  }

  createDailyNote() {
    const today = dayjs().startOf('day').toString()
    const existed = this.db.get('pages').find({ title: today }).value()
    if (!existed) {
      return this.createPage(today, {
        type: 'daily'
      });
    } else {
      return existed
    }
  }
}

const db = new DB()

ipc.answerRenderer('createDailyNote', async () => {
  return db.createDailyNote()
})

ipc.answerRenderer("updatePage", async ({ pageId, children }) => {
  return db.updatePage(pageId, children);
});

module.exports = db