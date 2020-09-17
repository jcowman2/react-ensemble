module.exports = {
  plugins: [
    "gatsby-plugin-theme-ui",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "docs",
        path: `${__dirname}/src/pages/docs`
      }
    },
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        defaultLayouts: {
          // default: require.resolve("./src/components/layouts/Layout.tsx"),
          docs: require.resolve("./src/components/DocsLayout.tsx")
        }
      }
    }
  ]
};
