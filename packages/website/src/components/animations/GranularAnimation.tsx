import React from "react";
/** @jsx jsx */
import { jsx } from "theme-ui";
import { Controller, Timeline, Lib } from "react-ensemble";
import theme from "../../gatsby-plugin-theme-ui/index";

const { d3Ease } = Lib;

const {
  primary: PRIMARY,
  secondary: SECONDARY,
  tertiary,
  text: TEXT
} = theme.colors!;
const TERTIARY = tertiary as string;

interface GranularAnimationState {
  s1color: string;
  s1width: number;
  s1top: number;
  s1left: number;
  s1opacity: number;

  s2color: string;
  s2width: number;
  s2top: number;
  s2left: number;
  s2opacity: number;

  s3color: string;
  s3width: number;
  s3top: number;
  s3left: number;
  s3opacity: number;

  s4color: string;
  s4width: number;
  s4top: number;
  s4left: number;
  s4opacity: number;
}

const defaultState: GranularAnimationState = {
  s1color: SECONDARY!,
  s1width: 30,
  s1top: 90,
  s1left: 0,
  s1opacity: 0,

  s2color: PRIMARY!,
  s2width: 30,
  s2top: 90,
  s2left: 40,
  s2opacity: 0,

  s3color: TEXT!,
  s3width: 30,
  s3top: 90,
  s3left: 80,
  s3opacity: 0,

  s4color: TERTIARY!,
  s4width: 30,
  s4top: 90,
  s4left: 120,
  s4opacity: 0
};

const trackAppear = [
  {
    layer: "0",
    start: 1000,
    duration: 800,
    state: {
      s1opacity: { to: 0.8 },
      s1top: { to: 50 }
    }
  },
  {
    layer: "1",
    start: 1500,
    duration: 800,
    state: {
      s2opacity: { to: 0.8 },
      s2top: { to: 50 }
    }
  },
  {
    layer: "2",
    start: 2000,
    duration: 800,
    state: {
      s3opacity: { to: 0.8 },
      s3top: { to: 50 }
    }
  },
  {
    layer: "3",
    start: 2500,
    duration: 800,
    state: {
      s4opacity: { to: 0.8 },
      s4top: { to: 50 }
    }
  }
];

const trackStairs = [
  {
    layer: "0",
    start: 3500,
    duration: 500,
    state: {
      s1top: { to: 120 }
    }
  },
  {
    layer: "1",
    start: 3500,
    duration: 500,
    state: {
      s2top: { to: 80 }
    }
  },
  {
    layer: "2",
    start: 3500,
    duration: 500,
    state: {
      s3top: { to: 40 }
    }
  },
  {
    layer: "3",
    start: 3500,
    duration: 500,
    state: {
      s4top: { to: 0 }
    }
  }
];

const trackStairsDown = [
  {
    layer: "0",
    duration: 500,
    state: {
      s1top: { to: 0 }
    }
  },
  {
    layer: "1",
    duration: 500,
    state: {
      s2top: { to: 40 }
    }
  },
  {
    layer: "2",
    duration: 500,
    state: {
      s3top: { to: 80 }
    }
  },
  {
    layer: "3",
    duration: 500,
    state: {
      s4top: { to: 120 }
    }
  }
];

const trackZip = [
  {
    layer: "0",
    duration: 800,
    state: {
      s1left: { to: 60 }
    }
  },
  {
    layer: "1",
    duration: 800,
    state: {
      s2left: { to: 60 }
    }
  },
  {
    layer: "2",
    duration: 800,
    state: {
      s3left: { to: 60 }
    }
  },
  {
    layer: "3",
    duration: 800,
    state: {
      s4left: { to: 60 }
    }
  }
];

const elastic = d3Ease.easeElastic.period(0.4).amplitude(1);

const trackCollapse = [
  {
    layer: "0",
    duration: 800,
    state: {
      s1top: { to: 60 }
    },
    easing: elastic
  },
  {
    layer: "1",
    duration: 800,
    state: {
      s2top: { to: 60 }
    },
    easing: elastic
  },
  {
    layer: "2",
    duration: 800,
    state: {
      s3top: { to: 60 }
    },
    easing: elastic
  },
  {
    layer: "3",
    duration: 800,
    state: {
      s4top: { to: 60 }
    },
    easing: elastic
  }
];

const GranularAnimation: React.FC = () => {
  const [spriteState, setSpriteState] = React.useState(defaultState);

  const {
    s1color,
    s1width,
    s1top,
    s1left,
    s1opacity,

    s2color,
    s2width,
    s2top,
    s2left,
    s2opacity,

    s3color,
    s3width,
    s3top,
    s3left,
    s3opacity,

    s4color,
    s4width,
    s4top,
    s4left,
    s4opacity
  } = spriteState;

  return (
    <React.Fragment>
      <Controller<GranularAnimationState> visible={false} trigger="auto">
        {props => (
          <Timeline
            defaultState={defaultState}
            onUpdate={({ state }) => setSpriteState(state)}
            endBehavior="boomerang"
            track={[
              ...trackAppear,
              ...trackStairs,
              ...trackStairsDown,
              ...trackZip,
              ...trackCollapse
            ]}
            {...props}
          />
        )}
      </Controller>
      <div
        sx={{
          width: "150px",
          height: "150px",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            width: s1width,
            height: s1width,
            backgroundColor: s1color,
            top: s1top,
            left: s1left,
            opacity: s1opacity
          }}
        />
        <div
          style={{
            position: "absolute",
            width: s2width,
            height: s2width,
            backgroundColor: s2color,
            top: s2top,
            left: s2left,
            opacity: s2opacity
          }}
        />
        <div
          style={{
            position: "absolute",
            width: s3width,
            height: s3width,
            backgroundColor: s3color,
            top: s3top,
            left: s3left,
            opacity: s3opacity
          }}
        />
        <div
          style={{
            position: "absolute",
            width: s4width,
            height: s4width,
            backgroundColor: s4color,
            top: s4top,
            left: s4left,
            opacity: s4opacity
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default GranularAnimation;
