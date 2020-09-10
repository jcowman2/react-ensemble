import { swiss as preset } from "@theme-ui/presets";
import { merge } from "theme-ui";

export default merge(preset, {
  links: {
    nav: {
      textDecoration: "none"
    }
  }
});
