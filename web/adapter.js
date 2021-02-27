import db from './db'

const adapter = {
  addBlock(block) {
    ipcRenderer.callMain("createBlock", { block });
  },
  getBlock(blockId) {
    return db.getBlockById(blockId);
  },
  updateBlock(blockId, body) {
    ipcRenderer.callMain("updateBlock", { blockId, body });
  },
  onPageChanged(page) {
    ipcRenderer.callMain("updatePage", {
      pageId: page.id,
      children: page.children,
    });
  },
};

export default adapter