import React from "react";
import { TrackUtils, Controller, Timeline } from "react-intime";

interface DemoAnimationState {
  borderRadius: number;
  width: number;
  height: number;
  color: string;
  angle: number;
}

const DemoAnimation: React.FC = () => {
  const defaultSpriteState = {
    borderRadius: 0,
    width: 60,
    height: 60,
    color: "#75E4B3",
    angle: 0
  };
  const [spriteState, setSpriteState] = React.useState(defaultSpriteState);

  const { borderRadius, width, height, color, angle } = spriteState;

  console.log("timeline", TrackUtils);

  return (
    <>
      <Controller<DemoAnimationState>>
        {props => (
          <Timeline
            {...props}
            track={[
              {
                duration: 3000,
                state: {
                  angle: { to: 360 }
                }
              },
              {
                duration: 1000,
                state: {
                  width: { to: 200 },
                  height: { to: 200 },
                  borderRadius: { to: 100 }
                }
              },
              { duration: 500 },
              {
                duration: 1000,
                state: {
                  height: { to: 20 }
                }
              },
              {
                duration: 500,
                state: {
                  width: { to: 500 }
                }
              },
              {
                duration: 1000,
                state: {
                  height: { to: 200 },
                  color: { to: "#561F37" },
                  borderRadius: { to: 5 }
                }
              }
            ]}
            defaultState={defaultSpriteState}
            onUpdate={({ state }) => setSpriteState(state)}
          />
        )}
      </Controller>
      <div style={{ height: 250 }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%"
          }}
        >
          <div
            style={{
              width: width,
              height: height,
              transform: `rotate(${angle}deg)`,
              backgroundColor: color,
              borderRadius: borderRadius
            }}
          />
        </div>
      </div>
    </>
  );
};

export default function Home() {
  // console.log("HEY", Def.reactIntime.TrackUtils.gen);
  return (
    <div>
      <h1>Hello, world!</h1>
      <DemoAnimation />
    </div>
  );
}
