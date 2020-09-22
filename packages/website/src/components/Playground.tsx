import React from "react";
/** @jsx jsx */
import { jsx, Container, Button, Text } from "theme-ui";
import theme from "../gatsby-plugin-theme-ui/index";
import prismTheme from "../theme/prism-react-renderer";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { Controller, Timeline } from "react-ensemble";

export interface PlaygroundProps {
  code: string;
}

const DEFAULT_COLOR = "black";
const MACROS = [
  ["__primary", theme.colors?.primary || DEFAULT_COLOR],
  ["__secondary", theme.colors?.secondary || DEFAULT_COLOR],
  ["__tertiary", (theme.colors?.tertiary as string) || DEFAULT_COLOR],
  ["__text", theme.colors?.text || DEFAULT_COLOR]
] as const;

const Playground: React.FC<PlaygroundProps> = props => {
  const { code } = props;

  const [isOpen, setIsOpen] = React.useState(true);
  const [formattedCode, setFormattedCode] = React.useState("");

  React.useEffect(() => {
    let codeWithMacros = code;
    for (let [macro, value] of MACROS) {
      codeWithMacros = codeWithMacros.replaceAll(macro, value);
    }
    setFormattedCode(codeWithMacros);
  }, [code, MACROS]);

  return (
    <LiveProvider
      code={formattedCode}
      scope={{ Controller, Timeline }}
      theme={prismTheme}
    >
      <LiveError />
      <LivePreview />
      <Container
        sx={{
          position: "relative",
          bg: "codeBg"
        }}
      >
        {!isOpen && (
          <Container p={3}>
            <Text sx={{ fontSize: 1, fontFamily: "monospace" }}>
              {"(Minimized Live Code)"}
            </Text>
          </Container>
        )}

        <Button
          sx={{
            fontSize: 0,
            bg: isOpen ? "primary" : "text",

            float: "right",
            color: "background",
            position: "absolute",
            top: 0,
            right: "12px",
            zIndex: 1,
            px: 2,
            py: 1,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            margin: 0,
            "&:hover": {
              bg: "secondary"
            }
          }}
          title="Toggle Code"
          onClick={() => setIsOpen(prev => !prev)}
        >
          {"</>"}
        </Button>
      </Container>
      {isOpen ? (
        <>
          <Container
            sx={{
              maxHeight: "410px",
              overflow: "scroll"
            }}
          >
            <LiveEditor />
          </Container>
        </>
      ) : (
        <Container />
      )}
    </LiveProvider>
  );
};

export default Playground;