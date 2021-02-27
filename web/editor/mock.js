export const mockData = {
  id: "root",
  content: "",
  children: [
    {
      id: "haha",
      content: "Let's begin with demo",
      children: [
        {
          id: "1614361791418",
          content: "Basic editing",
          children: [
            {
              id: "1614361794603",
              content: "Press `Enter` to create new block",
              children: [],
            },
            {
              id: "1614362712662",
              content:
                "Press `Shift + Enter` to add line\nLike this 👍\nJust another [[link]] in this line",
              children: [],
            },
          ],
        },
        {
          id: "1614360926168",
          content: "Link",
          children: [
            {
              id: "1614360692536",
              content: "This is a [[link]]",
              children: [],
            },
            {
              id: "1614363660988",
              content: "use `[[]]` to create a link",
              children: [],
            },
          ],
        },
        {
          id: "1614365607218",
          content: "Style",
          children: [
            {
              id: "1614365609464",
              content: "`**a text**` for bold. Like **strong**",
              children: [],
            },
          ],
        },
        {
          id: "1614360941449",
          content: "Todo Item",
          children: [
            {
              id: "1614360698923",
              content: "{{{TODO}}} This is a todo item",
              children: [
                {
                  id: "1614363676702",
                  content: "use `{{{TODO}}}` to create a todo checkbox",
                  children: [],
                },
                {
                  id: "second",
                  content: "Click the checkbox to toggle the todo",
                  children: [],
                },
                {
                  id: "1614367065171",
                  content:
                    "Of course you can put the checkbox anywhere {{{TODO}}} like here",
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: "1614361011073",
          content: "Code",
          children: [
            {
              id: "1614361015616",
              content: "This is a `inline code`",
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "1614361676687",
      content: "Roadmap",
      children: [
        {
          id: "1614361867716",
          content: "features",
          children: [
            {
              id: "1614362416963",
              content: "make cursor movement feel more nature",
              children: [
                {
                  id: "1614362433485",
                  content:
                    "{{{DONE}}} move the cursor to the text which was clicked",
                  children: [],
                },
                {
                  id: "1614362703406",
                  content: "{{{TODO}}} navigate to another block",
                  children: [],
                },
              ],
            },
            {
              id: "1614361678477",
              content: "{{{TODO}}} support code block",
              children: [],
            },
            {
              id: "1614363801754",
              content: "{{{TODO}}} editing history",
              children: [],
            },
            {
              id: "1614361819360",
              content: "{{{TODO}}} press `/` to quick command",
              children: [],
            },
            {
              id: "1614364528249",
              content: "Collapsable",
              children: [],
            },
            {
              id: "1614363166372",
              content: "Multi block selection",
              children: [],
            },
            {
              id: "1614365168427",
              content: "paste markdown list and transform it to block",
              children: [],
            },
          ],
        },
        {
          id: "1614361897496",
          content: "project",
          children: [
            {
              id: "1614362109192",
              content: "{{{TODO}}} Ship as a library",
              children: [],
            },
            {
              id: "1614362841062",
              content: "{{{TODO}}} Build an real world editor.",
              children: [
                {
                  id: "1614364559074",
                  content: "Save the data on local.",
                  children: [],
                },
                {
                  id: "1614364572589",
                  content: "Export as static page",
                  children: [],
                },
              ],
            },
            {
              id: "1614362127776",
              content: "{{{TODO}}} Documentation",
              children: [],
            },
            {
              id: "1614361900368",
              content: "{{{TODO}}} Contribution guide",
              children: [],
            },
          ],
        },
      ],
    },
  ],
};