import Link from './blocks/Link.svelte'
import DB from "./db";

export default [
  {
    match: /\[\[([^\]]+)\]\]/,
    processor(matched, position) {
      return {
        type: "LINK",
        component: Link,
        value: matched[1],
        page: DB.get().touchPageByTitle(matched[1]),
        matched,
        position,
      };
    },
  },
];
