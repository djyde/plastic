import Todo from "../blocks/builtin/Todo.svelte";
import Code from "../blocks/builtin/Code.svelte";
import Bold from "../blocks/builtin/Bold.svelte";

const builtinRules = [
  {
    match: /\`([^\`]*)\`/,
    processor(matched, position) {
      return {
        type: "CODE",
        meta: {
          component: Code,
        },
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
        meta: {
          component: Bold,
        },
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
        meta: {
          component: Todo,
          props: {
            checked: false,
          },
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
] as Rule[];

export type Token = {
  type: string;
  position: number;
  matched: RegExpMatchArray;
  meta?: any;
  value: string
};

export type Rule = {
  match: RegExp;
  processor(matched: RegExpMatchArray, position: number): Token;
};


export function tokenizer(str: string, rules: Rule[]) {
  let matches = builtinRules.concat(rules);

  let position = 0;
  let toMatch = str;
  let tokens = [] as Token[];

  let text: string | null = null;

  whileLoop: while (toMatch.length > 0) {
    let matched: RegExpMatchArray;
    for (const rule of matches) {
      if ((matched = toMatch.match(new RegExp(`^${rule.match.source}`)))) {
        toMatch = toMatch.slice(matched[0].length);
        // clear plain
        if (text !== null) {
          // @ts-expect-error
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
    // @ts-expect-error
    tokens.push({
      type: "TEXT",
      value: text,
      position,
    });
    position += text.length;
  }

  return tokens;
}
