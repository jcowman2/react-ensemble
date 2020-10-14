import React from "react";
/** @jsx jsx */
import { jsx, Styled } from "theme-ui";
import { MDXProviderComponents } from "@mdx-js/react";
import { Link } from "gatsby";
import { Controller, Timeline } from "react-ensemble";
import CodeBlock from "../components/CodeBlock";
import Playground from "../components/Playground";

type Props = {
  children?: React.ReactNode;
};

const heading = (Tag: React.ElementType) => (props: Props & { id: string }) => {
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

export default components;
