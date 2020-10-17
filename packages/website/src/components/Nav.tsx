import React from "react";
/** @jsx jsx */
import { jsx, Container, Heading, Flex } from "theme-ui";
import { Link } from "gatsby";
import ReactEnsembleLogo from "../content/images/react-ensemble-logo.svg";

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

const Nav: React.FC = () => {
  return (
    <Container>
      <Flex
        sx={{ flexDirection: ["column", "row", "row"], alignItems: "center" }}
      >
        <Container sx={{ maxWidth: "250px", mb: [2, 0, 0] }}>
          <a href="/">
            <ReactEnsembleLogo />
          </a>
        </Container>
        {/* <Container>
          <Heading as="h1">
            <StyledNavLink label="React Ensemble" linkTo="/" />
          </Heading>
        </Container> */}
        <Flex
          as="nav"
          sx={{
            flex: 1,
            justifyContent: ["flex-start", "flex-end", "flex-end"],
            alignItems: "center",
            mt: [2, 0]
          }}
        >
          <div sx={{ mr: 4 }}>
            <StyledNavLink label="Docs" linkTo="/docs/" />
          </div>
          <StyledNavLink
            external
            label="Github"
            linkTo="https://github.com/jcowman2/react-ensemble"
          />
        </Flex>
      </Flex>
    </Container>
  );
};

export default Nav;
