module.exports = {
  files: "**/*.mdx",
  typescript: true,
  docgenConfig: {
    searchPatterns: [
      "../**/*.{ts,tsx,js,jsx,mjs}",
      "!**/node_modules",
      "!**/doczrc.js"
    ]
  },
  menu: [],
  themeConfig: {
    initialColorMode: "light",
    showDarkModeSwitch: false,
    showPlaygroundEditor: false
  }
};
