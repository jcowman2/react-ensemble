declare module "@theme-ui/presets" {
  import { Theme } from "theme-ui";
  const presets: Record<
    "base" | "deep" | "bulma" | "tailwind" | "swiss",
    Theme
  >;
  export = presets;
}
