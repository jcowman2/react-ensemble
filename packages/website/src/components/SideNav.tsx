import React from "react";
/** @jsx jsx */
import { jsx, NavLink } from "theme-ui";
import { Location } from "@reach/router";
import { AccordionNav } from "@theme-ui/sidenav";
import Links from "../content/docLinks.mdx";
import { ReactSetter } from "../types/utils";

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

export interface SideNavProps {
  menuOpen: boolean;
  setMenuOpen: ReactSetter<boolean>;
}

const SideNav: React.FC<SideNavProps> = props => {
  const { menuOpen, setMenuOpen } = props;

  const nav = React.useRef(null);

  return (
    <Location>
      {({ location }) => (
        <div
          ref={nav}
          role="navigation"
          onFocus={() => {
            setMenuOpen(true);
          }}
          onBlur={() => {
            setMenuOpen(false);
          }}
          onClick={() => {
            setMenuOpen(false);
          }}
          onKeyPress={() => {
            setMenuOpen(false);
          }}
        >
          <Links
            {...props}
            open={menuOpen}
            components={{
              wrapper: (props: React.PropsWithChildren<{}>) => (
                <AccordionNav {...props} pathname={location.pathname} />
              ),
              a: makeLinkWrapper(location)
            }}
            sx={{
              px: 3,
              pt: 3,
              pb: 4,
              mr: 5
            }}
          />
        </div>
      )}
    </Location>
  );
};

export default SideNav;
