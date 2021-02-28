import DB from './db'
const db = DB.get()

const adapter = {
  addBlock(block) {
    db.createBlock(block)
  },
  getBlock(blockId) {
    return db.getBlockById(blockId);
  },
  updateBlock(blockId, body) {
    db.updateBlock(blockId, body)
  },
  deleteBlock(blockId) {
    db.deleteBlock(blockId)
  },
  onPageChanged(page) {
    console.log(page)
    db.updatePage(page.id, page.children)
  },
};

export default adapter