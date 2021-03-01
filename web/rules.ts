import Link from './blocks/Link.svelte'
import Tag from "./blocks/Tag.svelte";

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
  {
    match: /#([^ ]+)/,
    processor(matched, position) {
      const page = DB.get().touchPageByTitle(matched[1])
       return {
         type: "TAG",
         meta: {
           page,
           component: Tag,
           props: {
             page,
           },
         },
         value: matched[1],
         matched,
         position,
       };
    }
  }
] as Rule[];
