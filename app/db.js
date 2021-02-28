const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { nanoid } = require("nanoid");
const { ipcMain: ipc } = require("electron-better-ipc");
const dayjs = require("dayjs");

class DB {
  db;

  init() {
    const dbFilePath = "db.json";

    const adapter = new FileSync(dbFilePath);
    this.db = low(adapter);

    this.db
      .defaults({
        pages: [],
        blocks: {},
      })
      .write();
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
    return this.db.get('blocks').pickBy(_ => _.references && _.references.includes(pageId)).values().value()
  }

  traversalPage(pageId, cb) {
    const page = this.db.get('pages').find({ id: pageId }).value()

    function traversal(node, index = 0, pos = []) {
      const currentPos = pos.concat(index);
      cb(node, currentPos, page);
      if (node.children) {
        node.children.forEach((n, index) => {
          traversal(n, index, currentPos);
        });
      }
    }

    page.children.forEach((block, index) => { traversal(block, index, [0]) })
  }

  getFlatBlocksFromPage(pageId) {
    let map = {}
    this.traversalPage(pageId, (block, position, page) => {
      map[block.id] = {
        position,
        block,
        page
      }
    })

    return map
  }
}

const db = new DB();

module.exports = db;
