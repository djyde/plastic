import type { MarkOptional } from 'ts-essentials'

// Plastic file protocol

export type Page = {
  id: string,
  title: string,
  type?: string,
  children: ShallowBlock[]
}

export type ShallowBlock = {
  /** block id */
  id: string,
  children: ShallowBlock[]
}

export type Block = {
  id: string,
  content: string,
  pageId: string,
  references: Array<Page['id']>
}

export interface PlasticAdapter {
  directory: string;

  // static get: (id: string | number) => PlasticAdapter

  hasInit(): boolean;

  init(directory: string): void;

  /** create a page by title */
  createPage(pageTitle: string, meta?: any): Page;

  getPageById(pageId: string): Page;

  /** return the block id */
  createBlock(content: string, pageId: string): string;

  getBlockById(blockId: string): Block;

  updateBlock(
    blockId: string,
    body: {
      content?: Block["content"];
    }
  ): Block;

  updatePage(pageId: string, children: Page["children"]): Page;

  createDailyNote(): Page;

  touchPageByTitle(title: string): Page;

  deleteBlock(blockId: string): void;

  setBlockPageReferences(blockId: string, pageIds: string[]): void;

  findPageReferenceBlocks(pageId: string): Block[];

  traversalPage(
    pageId: string,
    cb: (node: ShallowBlock, currentPosition: number[], page: Page) => void
  ): void;

  getFlatBlocksFromPage(
    pageId: string
  ): { [key: string]: { position: number[]; block: ShallowBlock; page: Page } };

  searchPageByKeyword(keyword: string): Page[];
  getStaredPages(): Page[];
  starPage(pageId: string): void;
  unstarPage(pageId: string): void;
  isStared(pageId: string): boolean
}