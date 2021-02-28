const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { nanoid } = require("nanoid");
const { dialog, BrowserWindow, app } = require("electron");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");

function checkIsValidPlasticDirectory(directoryPath) {
  try {
    fs.accessSync(
      path.resolve(directoryPath, "./plastic.json"),
      fs.constants.F_OK
    );
    return true;
  } catch (e) {
    return false;
  }
}
class DB {
  db;

  directory

  static instances = {};

  static get(windowId = BrowserWindow.getFocusedWindow().id) {
    return DB.instances[windowId]
  }

  static openDirectoryOnWindow(directoryPath, windowId = BrowserWindow.getFocusedWindow())  {
    const isValid = checkIsValidPlasticDirectory(directoryPath);

    if (!isValid) {
      throw new Error("Not a valid plastic notebook");
    }

    if (!DB.instances[windowId]) {
      DB.instances[windowId] = new DB(directoryPath);
    }

    return DB.instances[windowId];
  }

  static async open(createIfNotExists = false) {
    const result = await dialog.showOpenDialog({
      title: "Open Plastic",
      properties: ["openDirectory", "createDirectory"],
    });

    if (result.filePaths.length) {
      const directory = result.filePaths[0];
      const isValid = checkIsValidPlasticDirectory(directory);

      if (!isValid && !createIfNotExists) {
        throw new Error("Not a valid plastic notebook");
      }

      const windowId = BrowserWindow.getFocusedWindow().id

      if (!DB.instances[windowId]) {
        console.log('new db instance for window', windowId)
        DB.instances[windowId] = new DB(directory);
      }

      return DB.instances[windowId];
    }
  }

  hasInit() {
    return !!this.db;
  }

  constructor(directory) {
    const adapter = new FileSync(path.resolve(directory, "./plastic.json"));
    this.db = low(adapter);

    this.db
      .defaults({
        pages: [],
        blocks: {},
        stars: [],
        main: null
      })
      .write();

    this.directory = directory;

    app.addRecentDocument(directory);
  }

  createPage(pageTitle, meta = {}) {
    const pageId = nanoid(8);

    const page = {
      title: pageTitle,
      id: pageId,
      ...meta,
      children: [
        {
          id: this.createBlock({
            id: nanoid(8),
            content: "",
            pageId,
          }),
          children: [],
        },
      ],
    };

    this.db.get("pages").push(page).write();

    return page;
  }

  getPageById(pageId) {
    return this.db.get("pages").find({ id: pageId }).value();
  }

  createBlock(block) {
    this.db.set(`blocks.${block.id}`, block).write();

    return block.id;
  }

  getBlockById(blockId) {
    // console.log(blockId, this.db.get(`blocks.${blockId}`).value());
    return this.db.get(`blocks.${blockId}`).value();
  }

  updateBlock(blockId, body) {
    return this.db.get(`blocks.${blockId}`).assign(body).write();
  }

  updatePage(pageId, children) {
    return this.db
      .get("pages")
      .find({ id: pageId })
      .assign({
        children,
      })
      .write();
  }

  createDailyNote() {
    const today = dayjs().startOf("day").toString();
    const existed = this.db.get("pages").find({ title: today }).value();
    if (!existed) {
      return this.createPage(today, {
        type: "daily",
      });
    } else {
      return existed;
    }
  }

  touchPageByTitle(title) {
    const existed = this.db.get("pages").find({ title }).value();
    if (!existed) {
      return this.createPage(title, {
        type: "default",
      });
    } else {
      return existed;
    }
  }

  deleteBlock(blockId) {
    this.db.unset(`blocks.${blockId}`).write();
  }

  setBlockPageReferences(blockId, pageIds) {
    this.db.set(`blocks.${blockId}.references`, pageIds).write();
  }

  findPageReferenceBlocks(pageId) {
    return this.db
      .get("blocks")
      .pickBy((_) => _.references && _.references.includes(pageId))
      .values()
      .value();
  }

  traversalPage(pageId, cb) {
    const page = this.db.get("pages").find({ id: pageId }).value();

    function traversal(node, index = 0, pos = []) {
      const currentPos = pos.concat(index);
      cb(node, currentPos, page);
      if (node.children) {
        node.children.forEach((n, index) => {
          traversal(n, index, currentPos);
        });
      }
    }

    page.children.forEach((block, index) => {
      traversal(block, index, [0]);
    });
  }

  getFlatBlocksFromPage(pageId) {
    let map = {};
    this.traversalPage(pageId, (block, position, page) => {
      map[block.id] = {
        position,
        block,
        page,
      };
    });

    return map;
  }

    
  searchPageByKeyword(keyword) {
    const reg = new RegExp(`${keyword}`, 'i')
    return this.db.get('pages').filter(page => page.title.match(reg)).take(10).value()
  }

  getStaredPages() {
    return this.db.get('stars').map(id => this.getPageById(id)).value()
  }

  starPage(pageId) {
    this.db.get('stars').push(pageId).write()
  }

  unstarPage(pageId) {
    this.db.set(
      "stars",
      this.db
        .get("stars")
        .filter((_) => _ !== pageId)
        .value()
    ).write();
  }

  isStared(pageId) {
    return this.db.get('stars').indexOf(pageId).value() !== -1
  }
}

module.exports = DB;
