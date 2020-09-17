import React from "react";
/** @jsx jsx */
import { jsx, Container, Flex, Heading } from "theme-ui";
import { MDXProvider } from "@mdx-js/react";
import { Link } from "gatsby";
import { Controller, Timeline } from "react-ensemble";
import Layout from "./Layout";
import SideNav from "./SideNav";
import Playground from "./Playground";

const shortcodes = { Link, Controller, Timeline, Playground };

const DocsLayout: React.FC<{
  pageContext: { frontmatter: { title: string } };
}> = props => {
  return (
    <Layout>
      <Flex mt={4}>
        <SideNav />
        <Container>
          <Heading as="h1" sx={{ mb: 3 }}>
            {props.pageContext.frontmatter.title}
          </Heading>
          <MDXProvider components={shortcodes}>{props.children}</MDXProvider>
        </Container>
      </Flex>
    </Layout>
  );
};

export default DocsLayout;
