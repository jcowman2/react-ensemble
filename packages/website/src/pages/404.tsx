import React from "react";
/** @jsx jsx */
import { jsx, Container, Text, Styled } from "theme-ui";
import Layout from "../components/Layout";
import LinkButton from "../components/LinkButton";

export default function PageNotFound() {
  return (
    <Layout>
      <Container mt={"20%"} sx={{ maxWidth: ["360px", "360px", "1080px"] }}>
        <Container sx={{ textAlign: "center" }}>
          <Text sx={{ fontSize: 5, mb: 2 }}>Page not Found</Text>
          <Text sx={{ fontSize: 3, mb: 5 }}>
            If something&apos;s missing, feel free to open an issue on{" "}
            <Styled.a href="https://github.com/jcowman2/react-ensemble/issues">
              GitHub
            </Styled.a>
            .
          </Text>
          <LinkButton label="Return Home" linkTo="/" />
        </Container>
      </Container>
    </Layout>
  );
}
