// Modified version of prism-theme-ui.ts to fit the format of prism-react-renderer for use with react-live
// Remember to edit prism-theme-ui.ts if you edit this file

export default {
  plain: {
    color: "black",
    backgroundColor: "#f5f2f0",
    fontSize: "14px",
    fontFamily: "Menlo, monospace"
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "slategray"
      }
    },
    {
      types: ["punctuation"],
      style: {
        color: "#999"
      }
    },
    {
      types: ["namespace"],
      style: {
        opacity: 0.7
      }
    },
    {
      types: [
        "property",
        "tag",
        "boolean",
        "number",
        "constant",
        "symbol",
        "deleted"
      ],
      style: {
        color: "#905"
      }
    },
    {
      types: ["selector", "attr-name", "string", "char", "builtin", "inserted"],
      style: {
        color: "690"
      }
    },
    {
      types: [
        "operator",
        "entity",
        "url"
        // .language-css .string,.style .string ?
      ],
      style: {
        color: "#9a6e3a",
        background: "hsla(0, 0%, 100%, .5)"
      }
    },
    {
      types: ["atrule", "attr-value", "keyword"],
      style: {
        color: "#07a"
      }
    },
    {
      types: ["function", "class-name"],
      style: {
        color: "#DD4A68"
      }
    },
    {
      types: ["regex", "important", "variable"],
      style: {
        color: "#e90"
      }
    }
  ]
};
