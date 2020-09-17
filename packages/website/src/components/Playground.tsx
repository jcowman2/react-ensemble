import React from "react";
/** @jsx jsx */
import { jsx } from "theme-ui";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { Controller, Timeline } from "react-ensemble";

export interface PlaygroundProps {
  code: string;
}

const Playground: React.FC<PlaygroundProps> = props => {
  return (
    <LiveProvider code={props.code} scope={{ Controller, Timeline }}>
      <LiveError />
      <LivePreview />
      <LiveEditor />
    </LiveProvider>
  );
};

export default Playground;
