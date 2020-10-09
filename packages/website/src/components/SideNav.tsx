import React from "react";
/** @jsx jsx */
import { jsx, NavLink } from "theme-ui";
import { Location } from "@reach/router";
import { AccordionNav } from "@theme-ui/sidenav";
import Links from "../content/docLinks.mdx";

const makeNavWrapper: (location: {
  pathname: string;
}) => React.FC = location => props => (
  <AccordionNav {...props} pathname={location.pathname} />
);

const isPathMatching = (pathname: string, href: string) => {
  return pathname === href || pathname === href + "/";
};

const makeLinkWrapper: (location: {
  pathname: string;
}) => React.FC<{ href: string }> = location => props => {
  return (
    <NavLink
      sx={{
        pb: 2,
        fontWeight: isPathMatching(location.pathname, props.href)
          ? "bold"
          : "normal",
        width: "100%",
        "&:hover": {
          color: "primary"
        },
        "&:active": {
          color: "secondary"
        }
      }}
      {...props}
    />
  );
};

const SideNav: React.FC = props => {
  return (
    <Location
      children={({ location }) => (
        <Links
          {...props}
          components={{
            wrapper: makeNavWrapper(location),
            a: makeLinkWrapper(location)
          }}
          sx={{ mr: 5, pt: 2 }}
        />
      )}
    />
  );
};

export default SideNav;
