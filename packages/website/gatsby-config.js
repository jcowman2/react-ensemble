const remarkSlug = require("remark-slug");

module.exports = {
  plugins: [
    "gatsby-plugin-theme-ui",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-remark-images",
      options: {
        backgroundColor: "transparent"
      }
    },

    {
      resolve: "gatsby-plugin-mdx",
      options: {
        defaultLayouts: {
          // default: require.resolve("./src/components/layouts/Layout.tsx"),
          docs: require.resolve("./src/components/DocsLayout.tsx")
        },
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 1200
            }
          }
        ],
        remarkPlugins: [remarkSlug]
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "docs",
        path: `${__dirname}/src/pages/docs`
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/content/images`
      }
    },
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        typekit: {
          id: "wtf4iyj"
        },
        google: {
          families: ["Open Sans:400,700"]
        }
      }
    }
  ]
};
