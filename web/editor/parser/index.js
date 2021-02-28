import Todo from "../blocks/builtin/Todo.svelte";
import Code from "../blocks/builtin/Code.svelte";
import Bold from "../blocks/builtin/Bold.svelte";

const builtinRules = [
  {
    match: /\`([^\`]*)\`/,
    processor(matched, position) {
      return {
        type: "CODE",
        component: Code,
        position,
        value: matched[1],
        matched,
      };
    },
  },
  {
    match: /\*\*([^\*]*)\*\*/,
    processor(matched, position) {
      return {
        type: "BOLD",
        component: Bold,
        value: matched[1],
        position,
        matched,
      };
    },
  },
  {
    match: /\{\{\{TODO\}\}\}/,
    processor(matched, position) {
      return {
        type: "TODO",
        component: Todo,
        props: {
          checked: false,
        },
        position,
        matched,
      };
    },
  },
  {
    match: /\{\{\{DONE\}\}\}/,
    processor(matched, position) {
      return {
        type: "DONE",
        component: Todo,
        props: {
          checked: true,
        },
        position,
        matched,
      };
    },
  },

];

export function tokenizer(str, rules) {

  let matches = builtinRules.concat(rules)

  let position = 0;
  let toMatch = str;
  let tokens = [];

  let text = null;

  whileLoop: while (toMatch.length > 0) {
    let matched;
    for (const rule of matches) {
      if ((matched = toMatch.match(new RegExp(`^${rule.match.source}`)))) {
        toMatch = toMatch.slice(matched[0].length);
        // clear plain
        if (text !== null) {
          tokens.push({
            type: "TEXT",
            value: text,
            position,
          });
          position += text.length;
          text = null;
        }

        tokens.push(rule.processor(matched, position));

        position += matched[0].length;

        continue whileLoop;
      }
    }

    text !== null ? (text += toMatch[0]) : (text = toMatch[0]);
    toMatch = toMatch.slice(1);
  }

  if (text !== null) {
    tokens.push({
      type: "TEXT",
      value: text,
      position,
    });
    position += text.length;
  }

  return tokens;
}
