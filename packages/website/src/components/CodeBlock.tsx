import React from "react";
/** @jsx jsx */
import { jsx } from "theme-ui";
import Playground from "./Playground";
import Prism from "@theme-ui/prism";

export interface CodeBlockProps {
  className: string;
  live?: boolean;
  children: string;
}

const CodeBlock: React.FC<CodeBlockProps> = props => {
  if (props.live) {
    return <Playground code={props.children.trim()} />;
  }
  return <Prism className={props.className}>{props.children.trim()}</Prism>;
};

export default CodeBlock;
