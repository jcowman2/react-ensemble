import React from "react";
/** @jsx jsx */
import { jsx } from "theme-ui";
import { Timeline } from "react-ensemble";
import { useAnimationControl } from "../../hooks/animationControl";

interface WhateverAnimationState {
  points: string;
  order: number[]; // FEATURE: Array interp // FEATURE: Index
  colors: string[];
  // tops: number[];

  s1top: number;
  s1opacity: number;
  s1left: number;

  s2top: number;
  s2opacity: number;
  s2left: number;

  s3top: number;
  s3opacity: number;
  s3left: number;
}

const defaultState: WhateverAnimationState = {
  points: "150,0 200,25 150,50 100,25",
  order: [3, 2, 1],
  colors: ["primary", "secondary", "tertiary"],
  // tops: [0, 0, 0],

  s1top: 0,
  s1opacity: 0,
  s1left: 0,

  s2top: 0,
  s2opacity: 0,
  s2left: 0,

  s3top: 0,
  s3opacity: 0,
  s3left: 0
};

const trackAppear = [
  {
    start: 1000,
    duration: 800,
    state: {
      s1top: { to: 40 },
      s2top: { to: 70 },
      s3top: { to: 100 },
      s1opacity: { to: 0.8 },
      s2opacity: { to: 0.8 },
      s3opacity: { to: 0.8 }
    }
  },
  { duration: 1000 },
  {
    duration: 800,
    state: {
      s2left: { to: -60 },
      s2opacity: { to: 0 }
    }
  },
  {
    duration: 800,
    state: {
      s3top: { to: 70 },
      order: { set: [2, 3, 1] },
      s2left: { from: 60, to: 0 },
      s2top: { set: 100 },
      s2opacity: { to: 0.8 }
    }
  }
];

const WhateverAnimation: React.FC = () => {
  const { playbackSpeed, value, onLoad } = useAnimationControl();
  const [spriteState, setSpriteState] = React.useState(defaultState);

  const { points, order, colors } = spriteState;

  return (
    <React.Fragment>
      <Timeline
        playing={false}
        defaultState={defaultState}
        onUpdate={({ state }) => setSpriteState(state)}
        endBehavior="boomerang"
        track={[...trackAppear]}
        playbackSpeed={playbackSpeed}
        value={value}
        onLoad={onLoad}
      />
      <div
        sx={{
          width: "300px",
          height: "150px",
          position: "relative"
        }}
      >
        <svg height="150" width="300">
          {order.map(id => (
            <polygon
              key={id}
              points={points}
              // @ts-ignore
              transform={`translate(${spriteState[`s${id}left`]}, ${
                // @ts-ignore
                spriteState[`s${id}top`]
              })`}
              sx={{
                fill: colors[id - 1],
                // @ts-ignore
                opacity: spriteState[`s${id}opacity`]
              }}
            />
          ))}
        </svg>
      </div>
    </React.Fragment>
  );
};

export default WhateverAnimation;
