import React from "react";
/** @jsx jsx */
import { jsx, Container, Box, Flex, Text } from "theme-ui";
import Nav from "../components/Nav";
import AnimationCard from "../components/AnimationCard";
import LinkButton from "../components/LinkButton";

export default function Home() {
  return (
    <main>
      <Container p={[4, 4, 5]} sx={{ maxWidth: "1280px" }}>
        <Nav />
        <Container
          p={[0, 0, 5]}
          mt={4}
          sx={{ maxWidth: ["360px", "360px", "100%"] }}
        >
          <Container sx={{ textAlign: "center" }}>
            <Text sx={{ variant: "text.hero" }}>
              <strong>Intuitive</strong> and <strong>precise</strong> control
              for complex animations in React
            </Text>
            <Flex sx={{ mt: 4, justifyContent: "center" }}>
              <LinkButton label="Get Started" linkTo="/docs/" sx={{ mr: 3 }} />
              <LinkButton label="Browse Docs" linkTo="/docs/" invert />
            </Flex>
          </Container>
        </Container>
        <Container
          sx={{
            mt: 5,
            display: "flex",
            justifyContent: ["flex-start", "center"]
          }}
        >
          <Flex
            sx={{
              justifyContent: "space-evenly",
              flexDirection: ["column", "column", "row"],
              maxWidth: ["600px", "100%"]
            }}
          >
            <AnimationCard
              title="Granular Control"
              body={[
                "Tune every keyframe and curve of your animation down to the millisecond.",
                "Use the powerful utilities included with d3-ease and d3-interpolate, or write your own."
              ]}
              sx={{ mr: [0, 0, 5], mb: 4 }}
            />
            <AnimationCard
              body={[
                "Play your animations effortlessly with native support for playback controls. No configuration necessary!"
              ]}
              title="Watch Immediately"
              sx={{ mr: [0, 0, 5], mb: 4 }}
            />
            <AnimationCard
              body={[
                "React Ensemble isn’t restricted to a single rendering engine—easily wire in Canvas, Konva, and more."
              ]}
              title="Render Whatever"
              sx={{ mb: 4 }}
            />
          </Flex>
        </Container>
      </Container>
    </main>
  );
}
