import { swiss as preset } from "@theme-ui/presets";
import prismPreset from "../theme/prism-theme-ui";
import { merge } from "theme-ui";

export default merge(preset, {
  colors: {
    codeBg: "#f5f2f0",
    text: "#231d35",
    primary: "#eb665b",
    secondary: "#f2914a",
    tertiary: "#ecce6a"
  },
  fonts: {
    monospace: "Menlo, monospace",
    heading: "allumi-std, sans-serif",
    body: '"Open Sans", system-ui, -apple-system, sans-serif'
  },
  links: {
    nav: {
      textDecoration: "none"
    },
    button: {
      textDecoration: "none",
      color: "background",
      py: 3,
      px: 4,
      borderRadius: 5,
      fontWeight: "bold",
      boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.1)",
      "&:hover": {
        opacity: 0.8
      }
    },
    heading: {
      color: "text",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline"
      },
      fontFamily: "heading"
    }
  },
  text: {
    hero: {
      fontSize: [4, 5, 6],
      fontFamily: "heading"
    }
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72],
  styles: {
    a: {
      textDecoration: "none",
      color: "primary",
      fontWeight: "bold"
    },
    code: {
      ...prismPreset
    },
    pre: {
      ...prismPreset
    },
    inlineCode: {
      px: 1,
      py: 1,
      borderRadius: 4,
      fontSize: 1
    }
  }
});
