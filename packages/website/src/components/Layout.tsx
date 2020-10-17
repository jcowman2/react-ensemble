import React from "react";
/** @jsx jsx */
import { jsx, Container, Text, Styled } from "theme-ui";
import Nav from "./Nav";

const Layout: React.FC = props => {
  return (
    <React.Fragment>
      <main>
        <Container p={[4, 4, 5]} sx={{ maxWidth: "1440px" }}>
          <Nav />
          {props.children}
        </Container>
      </main>
      <footer>
        <Container sx={{ width: "100%", textAlign: "center", my: 5 }}>
          <Text
            sx={{
              variant: "text.footnote",
              mb: 1
            }}
          >
            Copyright © 2020{" "}
            <Styled.a href="http://joecowman.com/">Joseph Cowman</Styled.a>. All
            rights reserved.
          </Text>
          <Text
            sx={{
              variant: "text.footnote"
            }}
          >
            React Ensemble is licensed under the{" "}
            <Styled.a href="https://choosealicense.com/licenses/mit/">
              MIT License
            </Styled.a>
            .
          </Text>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Layout;
