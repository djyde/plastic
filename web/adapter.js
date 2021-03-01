import DB from './db'

const adapter = {
  addBlock(block) {
    DB.get().createBlock(block)
  },
  getBlock(blockId) {
    return DB.get().getBlockById(blockId);
  },
  updateBlock(blockId, body) {
    DB.get().updateBlock(blockId, body)
  },
  deleteBlock(blockId) {
    DB.get().deleteBlock(blockId)
  },
  onPageChanged(page) {
    console.log(page)
    DB.get().updatePage(page.id, page.children)
  },
};

export default adapter