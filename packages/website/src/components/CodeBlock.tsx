import React from "react";
/** @jsx jsx */
import { jsx } from "theme-ui";
import theme from "../gatsby-plugin-theme-ui/index";
import Playground from "./Playground";
import Prism from "@theme-ui/prism";

export interface CodeBlockProps {
  className: string;
  live?: boolean;
  children: string;
  startHidden?: boolean;
  renderOnly?: boolean;
}

const DEFAULT_COLOR = "black";
const MACROS = [
  ["__primary", theme.colors?.primary || DEFAULT_COLOR],
  ["__secondary", theme.colors?.secondary || DEFAULT_COLOR],
  ["__tertiary", (theme.colors?.tertiary as string) || DEFAULT_COLOR],
  ["__text", theme.colors?.text || DEFAULT_COLOR]
] as const;

const CodeBlock: React.FC<CodeBlockProps> = props => {
  const {
    className,
    live,
    children,
    startHidden = false,
    renderOnly = false
  } = props;

  const [formattedCode, setFormattedCode] = React.useState("");

  React.useEffect(() => {
    let codeWithMacros = children.trim();
    for (const [macro, value] of MACROS) {
      codeWithMacros = codeWithMacros.replaceAll(macro, value);
    }
    setFormattedCode(codeWithMacros);
  }, [children]);

  if (live) {
    return (
      <Playground
        code={formattedCode}
        startHidden={startHidden}
        renderOnly={renderOnly}
      />
    );
  }
  return <Prism className={className}>{formattedCode}</Prism>;
};

export default CodeBlock;
