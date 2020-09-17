import React from "react";
/** @jsx jsx */
import { jsx, Container } from "theme-ui";
import Nav from "./Nav";

const Layout: React.FC = props => {
  return (
    <main>
      <Container p={[4, 4, 5]} sx={{ maxWidth: "1440px" }}>
        <Nav />
        {props.children}
      </Container>
    </main>
  );
};

export default Layout;
