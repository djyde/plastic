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
      blocks: {}
    }).write();
  }

  createPage(pageTitle, meta = {}) {
    const blockId = this.createBlock({
      id: nanoid(8),
      content: ''
    })

    const page = {
      title: pageTitle,
      id: nanoid(8),
      ...meta,
      children: [
        {
          id: blockId,
          children: []
        },
      ],
    };

    this.db.get('pages').push(page).write()

    return page
  }

  getPageById(pageId) {
    return this.db.get('pages').find({id: pageId}).value()
  }

  createBlock(block) {
    this.db.set(`blocks.${block.id}`, block)
      .write()

    return block.id
  }

  getBlockById(blockId) {
    // console.log(blockId, this.db.get(`blocks.${blockId}`).value());
    return this.db.get(`blocks.${blockId}`).value()
  }

  updateBlock(blockId, body) {
    return this.db.get(`blocks.${blockId}`).assign(body).write()
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

  touchPageByTitle(title) {
    const existed = this.db.get("pages").find({ title }).value();
    console.log(existed)
    if (!existed) {
      return this.createPage(title, {
        type: 'default'
      })
    } else {
      return existed
    }
  }

  deleteBlock(blockId) {
    this.db.unset(`blocks.${blockId}`).write()
  }
}

const db = new DB()

module.exports = db