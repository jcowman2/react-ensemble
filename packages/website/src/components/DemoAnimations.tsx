import React from "react";
import { Controller, Timeline } from "react-intime";

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

const DemoAnimation2: React.FC = () => {
  const [tick, setTick] = React.useState(0);
  const defaultSquareState = {
    x: 0,
    y: 10,
    width: 20,
    angle: 0,
    color: "green"
  };
  const [squareState, setSquareState] = React.useState(defaultSquareState);
  const { x, y, width, angle, color } = squareState;
  return (
    <>
      <Timeline
        value={tick}
        playing
        endBehavior="loop"
        defaultState={defaultSquareState}
        track={[
          {
            start: 1000,
            duration: 2000,
            state: {
              x: { to: 200 },
              color: { set: "red" }
            }
          },
          {
            duration: 2000,
            state: {
              y: { to: 200 },
              width: { to: 50 },
              color: { set: "blue" }
            }
          },
          {
            duration: 1000,
            state: {
              x: { to: 500 },
              y: { to: 20 },
              width: { to: 10 },
              angle: { to: 360 }
            }
          }
        ]}
        onTick={({ value }) => setTick(value)}
        onUpdate={({ state }) => setSquareState(state)}
      />
      <div style={{ height: 250 }}>
        <div
          style={{
            position: "relative",
            left: x,
            top: y,
            width: width,
            height: width,
            transform: `rotate(${angle}deg)`,
            backgroundColor: color
          }}
        />
      </div>
    </>
  );
};
