import theme from "../gatsby-plugin-theme-ui/index";

const { primary, secondary, tertiary, text } = theme.colors!;
const PRIMARY = primary!;
const SECONDARY = secondary!;
const TERTIARY = tertiary as string;
const TEXT = text!;

export { PRIMARY, SECONDARY, TERTIARY, TEXT };
