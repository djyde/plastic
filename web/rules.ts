import Link from './blocks/Link.svelte'
import DB from "./db";
import type { Rule } from './editor/parser';

export default [
  {
    match: /\[\[([^\]]+)\]\]/,
    processor(matched, position) {
      return {
        type: "LINK",
        meta: {
          component: Link,
          page: DB.get().touchPageByTitle(matched[1]),
        },
        value: matched[1],
        matched,
        position,
      };
    },
  },
] as Rule[];
