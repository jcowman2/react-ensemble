import React from "react";
/** @jsx jsx */
import { jsx, Container } from "theme-ui";
import Nav from "../components/Nav";
import { DemoAnimation } from "../components/DemoAnimations";

export default function Home() {
  return (
    <main>
      <Container p={5} sx={{ maxWidth: "1280px" }}>
        <Nav />
        <div sx={{ mt: 5 }}>
          <DemoAnimation />
        </div>
      </Container>
    </main>
  );
}
