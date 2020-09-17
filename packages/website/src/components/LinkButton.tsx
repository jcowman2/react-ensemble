import React from "react";
/** @jsx jsx */
import { jsx } from "theme-ui";
import { Link } from "gatsby";

export interface LinkButtonProps {
  label: string;
  linkTo: string;
  className?: string;
  invert?: boolean;
}

const LinkButton: React.FC<LinkButtonProps> = props => {
  const variableStyles = props.invert
    ? {
        bg: "background",

        color: "primary"
      }
    : {
        bg: "primary"
      };
  return (
    <Link
      to={props.linkTo}
      sx={{
        variant: "links.button",
        ...variableStyles,
        borderStyle: "solid",
        borderColor: "primary",
        borderWidth: "3px",
        py: [1, 2, 3],
        px: [2, 3, 4],
        borderRadius: 3,
        "&:hover": {
          opacity: 0.5
        }
      }}
      className={props.className}
    >
      {props.label}
    </Link>
  );
};

export default LinkButton;
