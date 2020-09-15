import { swiss as preset } from "@theme-ui/presets";
import { merge } from "theme-ui";

export default merge(preset, {
  links: {
    nav: {
      textDecoration: "none"
    },
    button: {
      textDecoration: "none",
      color: "background"
    }
  },
  text: {
    hero: {
      fontSize: [4, 5, 6]
    }
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 52, 64, 72]
});
