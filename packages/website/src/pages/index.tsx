import React from "react";
/** @jsx jsx */
import { jsx, Container, Box, Flex, Text } from "theme-ui";
import Layout from "../components/Layout";
import AnimationCard from "../components/AnimationCard";
import LinkButton from "../components/LinkButton";
import GranularAnimation from "../components/animations/GranularAnimation";
import WhateverAnimation from "../components/animations/WhateverAnimation";
import LandingController from "../components/LandingController";
import { HomePageContext } from "../context/HomePageContext";

export default function Home() {
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1);
  const [progress, setProgress] = React.useState(0);

  return (
    <HomePageContext.Provider
      value={{ playbackSpeed, setPlaybackSpeed, progress, setProgress }}
    >
      <Layout>
        <Container
          p={[0, 0, 5]}
          pt={[0, 5, 4]}
          mt={4}
          sx={{ maxWidth: ["360px", "360px", "1280px"] }}
        >
          <Container sx={{ textAlign: "center" }}>
            <Text sx={{ variant: "text.hero" }}>
              <strong>Intuitive</strong> and <strong>precise</strong> control
              for complex animations in React
            </Text>
            <Flex
              sx={{
                mt: 4,
                justifyContent: "center",
                flexDirection: ["column", "row", "row"]
              }}
            >
              <LinkButton
                label="Get Started"
                linkTo="/docs/"
                sx={{ mr: [0, 3, 3], mb: [3, 0, 0] }}
              />
              <LinkButton label="Browse Docs" linkTo="/docs/" invert />
            </Flex>
          </Container>
        </Container>
        <Container
          sx={{
            display: "flex",
            justifyContent: ["flex-start", "center"],
            mt: [5, 5, 0]
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
            >
              <GranularAnimation />
            </AnimationCard>
            <AnimationCard
              body={[
                "Play your animations effortlessly with native support for playback controls. No configuration necessary!"
              ]}
              title="Watch Immediately"
              sx={{ mr: [0, 0, 5], mb: 4 }}
            >
              <LandingController />
            </AnimationCard>
            <AnimationCard
              body={[
                "React Ensemble isn’t restricted to a single rendering method—easily wire in Canvas, Konva, and more."
              ]}
              title="Render Whatever"
              sx={{ mb: 4 }}
            >
              <WhateverAnimation />
            </AnimationCard>
          </Flex>
        </Container>
      </Layout>
    </HomePageContext.Provider>
  );
}
