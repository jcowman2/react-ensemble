import { swiss as preset } from "@theme-ui/presets";
import prismPreset from "../theme/prism-theme-ui";
import { merge } from "theme-ui";

export default merge(preset, {
  colors: {
    codeBg: "#f5f2f0"
  },
  fonts: {
    monospace: "Menlo, monospace"
  },
  links: {
    nav: {
      textDecoration: "none"
    },
    button: {
      textDecoration: "none",
      color: "background"
    },
    heading: {
      color: "text",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline"
      }
    }
  },
  text: {
    hero: {
      fontSize: [4, 5, 6]
    }
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 52, 64, 72],
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
    }
  }
});
