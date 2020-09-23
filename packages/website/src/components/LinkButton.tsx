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
        ...variableStyles
      }}
      className={props.className}
    >
      {props.label}
    </Link>
  );
};

export default LinkButton;
