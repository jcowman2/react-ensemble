import React from "react";
/** @jsx jsx */
import { jsx, Container, Heading, Flex } from "theme-ui";
import { Link } from "gatsby";

const StyledNavLink: React.FC<{
  label: string;
  linkTo: string;
  external?: boolean;
}> = props => {
  return props.external ? (
    <a
      href={props.linkTo}
      sx={{
        variant: "links.nav",
        color: "inherit",
        "&:hover": {
          color: "primary"
        }
      }}
    >
      {props.label}
    </a>
  ) : (
    <Link
      to={props.linkTo}
      sx={{
        variant: "links.nav",
        color: "inherit",
        "&.active": {
          color: "inherit"
        },
        "&:hover": {
          color: "primary"
        }
      }}
      activeClassName="active"
    >
      {props.label}
    </Link>
  );
};

const Nav: React.FC = props => {
  return (
    <Container>
      <Flex>
        <div>
          <Heading as="h1">
            <StyledNavLink label="React Ensemble" linkTo="/" />
          </Heading>
        </div>
        <Flex
          as="nav"
          sx={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}
        >
          <div sx={{ mr: 4 }}>
            <StyledNavLink label="Docs" linkTo="/docs/" />
          </div>
          <StyledNavLink
            external
            label="Github"
            linkTo="https://github.com/jcowman2/react-intime"
          />
        </Flex>
      </Flex>
    </Container>
  );
};

export default Nav;
