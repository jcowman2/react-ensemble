import React from "react";
/** @jsx jsx */
import { jsx, Container, Flex, Heading } from "theme-ui";
import { MDXProvider } from "@mdx-js/react";
import Layout from "./Layout";
import SideNav from "./SideNav";
import mdxComponents from "../gatsby-plugin-theme-ui/components";
import SEO from "./SEO";

const DocsLayout: React.FC<{
  pageContext: { frontmatter: { title: string } };
}> = props => {
  const { title } = props.pageContext.frontmatter;
  return (
    <Layout>
      <SEO title={title} />
      <Flex sx={{ mt: 4 }}>
        <SideNav />
        <Container sx={{ maxWidth: "720px" }}>
          <Heading as="h1" sx={{ mb: 3 }}>
            {title}
          </Heading>
          <MDXProvider components={mdxComponents}>{props.children}</MDXProvider>
        </Container>
      </Flex>
    </Layout>
  );
};

export default DocsLayout;
