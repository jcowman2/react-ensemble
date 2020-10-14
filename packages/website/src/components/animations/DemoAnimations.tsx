import React from "react";
import { Controller, Timeline, TrackUtils, Lib } from "react-ensemble";
import { PRIMARY, SECONDARY, TERTIARY } from "../../theme/colors";

interface DemoAnimationState {
  borderRadius: number;
  width: number;
  height: number;
  color: string;
  angle: number;
}

export const DemoAnimation: React.FC = () => {
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

export const DemoAnimation2: React.FC = () => {
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

interface DemoAnimation3State {
  circleMorph: number;
  width: number;
  color: string;
  x: number;
  y: number;
  opacity: number;
  angle: number;
}

export const DemoAnimation3: React.FC = () => {
  const WINDOW_HEIGHT = 250;
  const { multi } = TrackUtils;

  const defaultAnimState = {
    circleMorph: 1,
    width: 30,
    color: PRIMARY,
    x: -250,
    y: 50,
    opacity: 0,
    angle: 0
  };

  const track = [
    {
      duration: 1500,
      state: {
        opacity: { to: 1 },
        x: { to: 0 }
      }
    },
    multi<DemoAnimation3State>([
      {
        duration: 100,
        state: {
          circleMorph: { to: 0 }
        }
      },
      {
        duration: 1000,
        state: {
          width: { to: 50 }
        },
        easing: Lib.d3Ease.easeElastic
      }
    ]),
    multi<DemoAnimation3State>([
      [
        {
          start: 2500,
          duration: 750,
          state: {
            y: { to: 200 }
          },
          easing: Lib.d3Ease.easeExpIn,
          loop: {
            count: 1,
            boomerang: true
          }
        },
        {
          duration: 0,
          state: {
            y: { set: 50 }
          }
        }
      ],
      [
        {
          start: 3250,
          duration: 1500,
          state: {
            angle: { to: 360 }
          }
        },
        {
          duration: 750,
          state: {
            angle: { to: 180 }
          }
        }
      ],
      [
        {
          start: 3250,
          duration: 1500,
          state: {
            color: { from: TERTIARY, to: SECONDARY }
          },
          easing: Lib.d3Ease.easeLinear
        },
        {
          duration: 750,
          state: {
            color: { from: TERTIARY, to: SECONDARY }
          },
          easing: Lib.d3Ease.easeLinear
        }
      ]
    ]),
    multi<DemoAnimation3State>([
      {
        duration: 100,
        state: {
          circleMorph: { to: 1 }
        }
      },
      {
        duration: 1000,
        state: {
          width: { to: 30 }
        },
        easing: Lib.d3Ease.easeElastic
      }
    ]),
    {
      duration: 1500,
      state: {
        opacity: { to: 0 },
        x: { to: 250 }
      }
    }
  ];

  const [animState, setAnimState] = React.useState(defaultAnimState);

  return (
    <>
      <Controller>
        {props => (
          <Timeline
            {...props}
            defaultState={defaultAnimState}
            track={track}
            onUpdate={({ state }) => setAnimState(state)}
          />
        )}
      </Controller>
      <div
        style={{
          height: WINDOW_HEIGHT,
          width: "100%",
          position: "relative",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: animState.width * animState.circleMorph * 0.5,
            width: animState.width,
            height: animState.width,
            backgroundColor: animState.color,
            left: animState.x,
            top: animState.y - animState.width / 2,
            opacity: animState.opacity,
            transform: `rotate(${animState.angle}deg)`
          }}
        />
      </div>
    </>
  );
};

interface DemoAnimation3State {
  width1: number;
  width2: number;
  morph1: number;
  morph2: number;
}

export const DemoAnimation4: React.FC = () => {
  const { multi } = TrackUtils;
  const { d3Ease } = Lib;

  const defaultState = { width1: 30, width2: 30, morph1: 1, morph2: 1 };
  const track = [
    { duration: 1000 },
    multi<DemoAnimation3State>([
      multi<DemoAnimation3State>([
        {
          duration: 100,
          state: {
            morph1: { to: 0 }
          }
        },
        {
          duration: 1000,
          state: {
            width1: { to: 50 }
          }
        }
      ]),
      multi<DemoAnimation3State>([
        {
          duration: 100,
          state: {
            morph2: { to: 0 }
          }
        },
        {
          duration: 1000,
          state: {
            width2: { to: 50 }
          },
          easing: d3Ease.easeElastic
        }
      ])
    ])
  ];

  const [animState, setAnimState] = React.useState(defaultState);

  return (
    <>
      <Controller trigger="auto" visible={false}>
        {props => (
          <Timeline
            {...props}
            endBehavior="loop"
            defaultState={defaultState}
            track={track}
            onUpdate={({ state }) => setAnimState(state)}
          />
        )}
      </Controller>
      <div
        style={{
          height: 150,
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: animState.width1 * animState.morph1 * 0.5,
              width: animState.width1,
              height: animState.width1,
              backgroundColor: PRIMARY
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: animState.width2 * animState.morph2 * 0.5,
              width: animState.width2,
              height: animState.width2,
              backgroundColor: PRIMARY
            }}
          />
        </div>
      </div>
    </>
  );
};
