import { writable } from "svelte/store";

export const editingBlockId = writable(null);
export const anchorOffset = writable(null);


export function onChangeBlock(block, root) {
  // NOTE: DON'T mutate the `block` and `root` unless you know what you're doing
  console.log(block, root)
}
