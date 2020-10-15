import React from "react";
/** @jsx jsx */
import { jsx } from "theme-ui";
import { Pagination } from "@theme-ui/sidenav";
import { Location } from "@reach/router";
import Links from "../content/docLinks.mdx";

const DocsPagination: React.FC = () => {
  return (
    <Location>
      {({ location }) => (
        <Links
          pathname={location.pathname}
          components={{
            wrapper: (props: React.PropsWithChildren<{ pathname: string }>) => (
              <Pagination
                {...props}
                sx={{
                  mt: 5,
                  "a:hover": { color: "primary" },
                  "a>div:last-child": { fontSize: [2, 3, 3] }
                }}
              />
            )
          }}
        />
      )}
    </Location>
  );
};

export default DocsPagination;
