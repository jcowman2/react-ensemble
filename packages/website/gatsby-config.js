const remarkSlug = require("remark-slug");

module.exports = {
  siteMetadata: {
    title: "React Ensemble",
    titleTemplate: "%s | React Ensemble",
    description:
      "Intuitive and precise control for complex animations in React.",
    url: "https://www.react-ensemble.dev",
    image: "/images/react-ensemble-animation-library-logo.jpg"
  },
  plugins: [
    "gatsby-plugin-theme-ui",
    "gatsby-plugin-sharp",
    "gatsby-plugin-react-helmet",
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
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /src\/content/ // See below to configure properly
        }
      }
    }
  ]
};
