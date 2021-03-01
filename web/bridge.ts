import DB from './db'
import type { Block, Page } from './plastic';

const adapter = {
  addBlock(content: string, pageId: string) {
    return DB.get().createBlock(content, pageId)
  },
  getBlock(blockId: string) {
    return DB.get().getBlockById(blockId);
  },
  // TODO: type body
  updateBlock(blockId: string, body) {
    DB.get().updateBlock(blockId, body)
  },
  deleteBlock(blockId: string) {
    DB.get().deleteBlock(blockId)
  },
  onPageChanged(page: Page) {
    DB.get().updatePage(page.id, page.children)
  },
};

export default adapter