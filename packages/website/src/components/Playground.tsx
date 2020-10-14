import React from "react";
/** @jsx jsx */
import { jsx, Container, Button, Text } from "theme-ui";
import prismTheme from "../theme/prism-react-renderer";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { Controller, Timeline, Lib, TrackUtils } from "react-ensemble";

export interface PlaygroundProps {
  code: string;
  startHidden: boolean;
  renderOnly: boolean;
}

const Playground: React.FC<PlaygroundProps> = props => {
  const { code, startHidden, renderOnly } = props;
  const [isOpen, setIsOpen] = React.useState(!startHidden);

  return (
    <LiveProvider
      code={code}
      scope={{ Controller, Timeline, Lib, TrackUtils }}
      theme={prismTheme}
    >
      <LiveError />
      <LivePreview />
      {!renderOnly && (
        <>
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
        </>
      )}
    </LiveProvider>
  );
};

export default Playground;
