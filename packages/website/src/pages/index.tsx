import React from "react";
/** @jsx jsx */
import { jsx, Styled, Container, Flex, NavLink, Button } from "theme-ui";
import { Link } from "gatsby";

export default function Home() {
  return (
    <main>
      <Container p={5}>
        <Flex as="nav">
          <NavLink href="#!" p={5}>
            Home
          </NavLink>
          <NavLink href="#!" p={5}>
            Docs
          </NavLink>
          <NavLink href="#!" p={5}>
            About
          </NavLink>
        </Flex>
        {/* <Container> */}
        <Styled.h1>React Ensemble</Styled.h1>
        <Styled.h3>
          Intuitive and precise control over complex animation timing for React
        </Styled.h3>
        <Link
          to="/docs/"
          activeClassName="active"
          sx={{
            backgroundColor: "primary",
            paddingTop: 3,
            paddingBottom: 3,
            paddingLeft: 4,
            paddingRight: 4,
            fontSize: 3,
            borderRadius: 2,
            color: "text",
            textDecoration: "none",
            "&.active": {
              color: "secondary"
            }
          }}
        >
          Link
        </Link>

        {/* </Container> */}
      </Container>
    </main>
  );
}
