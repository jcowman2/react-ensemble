import React from "react";
/** @jsx jsx */
import { jsx } from "theme-ui";
import Playground from "./Playground";
import Prism from "@theme-ui/prism";

export interface CodeBlockProps {
  className: string;
  live?: boolean;
  children: string;
  startHidden?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = props => {
  const { className, live, children, startHidden = false } = props;

  if (live) {
    return <Playground code={children.trim()} startHidden={startHidden} />;
  }
  return <Prism className={className}>{children.trim()}</Prism>;
};

export default CodeBlock;
