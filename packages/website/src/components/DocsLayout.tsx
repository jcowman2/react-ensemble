import React from "react";
/** @jsx jsx */
import { jsx, Container, Flex, Heading, Box, Button } from "theme-ui";
import { MDXProvider } from "@mdx-js/react";
import Layout from "./Layout";
import SideNav from "./SideNav";
import mdxComponents from "../gatsby-plugin-theme-ui/components";
import SEO from "./SEO";
import DocsPagination from "./DocsPagination";

const DocsLayout: React.FC<{
  pageContext: { frontmatter: { title: string } };
}> = props => {
  const { title } = props.pageContext.frontmatter;
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <Layout>
      <SEO title={title} />
      <Flex sx={{ mt: 4, flexDirection: ["column", "row", "row"] }}>
        <SideNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <Box sx={{ display: [null, "none"] }}>
          <Button
            onClick={() => setMenuOpen(prev => !prev)}
            sx={{
              width: "100%",
              variant: "buttons.info",
              mb: 4
            }}
          >
            Menu
          </Button>
        </Box>
        <Container sx={{ maxWidth: "720px" }}>
          <Heading as="h1" sx={{ mb: 3 }}>
            {title}
          </Heading>
          <MDXProvider components={mdxComponents}>{props.children}</MDXProvider>
          <DocsPagination />
        </Container>
      </Flex>
    </Layout>
  );
};

export default DocsLayout;
