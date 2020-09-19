import React from "react";
/** @jsx jsx */
import { jsx, Container, Flex, Heading, Styled } from "theme-ui";
import { MDXProvider, MDXProviderComponents } from "@mdx-js/react";
import { Link } from "gatsby";
import { Controller, Timeline } from "react-ensemble";
import Layout from "./Layout";
import SideNav from "./SideNav";
import Playground from "./Playground";
import CodeBlock from "./CodeBlock";

type Props = {
  children: React.ReactNode;
};

const heading = (Tag: any) => (props: any) => {
  if (!props.id) return <Tag {...props} />;
  return (
    <Tag {...props}>
      <a sx={{ variant: "links.heading" }} href={`#${props.id}`}>
        {props.children}
      </a>
    </Tag>
  );
};

const components: MDXProviderComponents = {
  Link,
  Controller,
  Timeline,
  Playground,
  // @ts-ignore -- type checker doesn't allow this line, but it's necessary for the code blocks to format correctly
  pre: (props: Props) => props.children,
  a: (props: Props) => <Styled.a {...props} />,
  code: CodeBlock,
  inlineCode: (props: Props) => <Styled.inlineCode {...props} />,
  h1: heading("h1"),
  h2: heading("h2"),
  h3: heading("h3"),
  h4: heading("h4"),
  h5: heading("h5"),
  h6: heading("h6")
};

const DocsLayout: React.FC<{
  pageContext: { frontmatter: { title: string } };
}> = props => {
  return (
    <Layout>
      <Flex sx={{ mt: 4 }}>
        <SideNav />
        <Container sx={{ maxWidth: "720px" }}>
          <Heading as="h1" sx={{ mb: 3 }}>
            {props.pageContext.frontmatter.title}
          </Heading>
          <MDXProvider components={components}>{props.children}</MDXProvider>
        </Container>
      </Flex>
    </Layout>
  );
};

export default DocsLayout;
