import Link from './blocks/Link.svelte'
import DB from "./db";
const db = DB.get();

export default [
  {
    match: /\[\[([^\]]+)\]\]/,
    processor(matched, position) {
      return {
        type: "LINK",
        component: Link,
        value: matched[1],
        page: db.touchPageByTitle(matched[1]),
        matched,
        position,
      };
    },
  },
];
