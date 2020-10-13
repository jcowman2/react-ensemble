import { gen } from "./gen";
import { inspect } from "util";
import { ILoopConfig, ITrackRegion } from "../trackUtils.types";
import { Lib } from "../../..";

const easeLinear = Lib.d3Ease.easeLinear;

const debugLog = (data: unknown) => console.log(inspect(data, false, null));

describe("TrackUtils.gen()", () => {
  const sampleTrack1 = [
    {
      start: 0,
      duration: 1500,
      state: {
        y: { to: 200 },
        color: { to: "#453823" }
      }
    }
  ];

  const sampleDefaults1 = {
    y: 10,
    color: "#75E4B3"
  };

  const sampleCalculatedTrack1 = {
    start: 0,
    duration: 1500,
    end: 1500,
    state: {
      y: { from: 10, to: 200 },
      color: { from: "#75E4B3", to: "#453823" }
    },
    easing: null,
    interp: null,
    layer: "_default"
  };

  const sampleMultiTrack1 = [
    {
      start: 0,
      duration: 1000,
      state: {
        x: { from: 0, to: 200 }
      },
      layer: "1"
    },
    {
      start: 0,
      duration: 0,
      state: {
        x: { set: 0 }
      },
      layer: "2"
    },
    {
      start: 800,
      end: 900,
      state: {
        x: { to: 400 }
      },
      layer: "2"
    }
  ];

  const sampleMultiDefaults1 = {
    x: 100
  };

  const sampleMultiTrack2 = [
    {
      layer: "1",
      duration: 1000,
      state: {
        x1: { to: 100 }
      }
    },
    {
      layer: "2",
      start: 300,
      duration: 1000,
      state: {
        x2: { to: 100 }
      }
    },
    {
      layer: "3",
      start: 800,
      duration: 1000,
      state: {
        x3: { to: 100 }
      }
    },
    {
      layer: "4",
      start: 900,
      duration: 1000,
      state: {
        x4: { to: 100 }
      }
    }
  ];

  const sampleMultiDefaults2 = {
    x1: 0,
    x2: 0,
    x3: 0,
    x4: 0
  };

  const sampleMultiTrack3: ITrackRegion[] = [
    {
      layer: "loop",
      state: {
        x: { to: 1 }
      },
      loop: {
        boomerang: true
      },
      duration: 1000
    },
    {
      layer: "main",
      state: {
        y: { to: 1 }
      },
      start: 1000,
      duration: 1000
    }
  ];

  const sampleMultiDefaults3 = {
    x: 0,
    y: 0
  };

  test("result#layers places regions in the _default layer by default", () => {
    const { layers } = gen(sampleTrack1, sampleDefaults1);

    expect(Object.keys(layers)).toEqual(["_default"]);
    expect(layers["_default"].length).toEqual(2); // account for end pad
    expect(layers["_default"][0]).toEqual(
      expect.objectContaining(sampleCalculatedTrack1)
    );
  });

  test("result#getFrameState with one variable modified across two layers calculates the correct value", () => {
    const { getFrameState } = gen(sampleMultiTrack1, sampleMultiDefaults1, {
      easing: easeLinear
    });

    expect(getFrameState(0).x).toEqual(0);
    expect(getFrameState(500).x).toEqual(100);
    expect(getFrameState(800).x).toEqual(0);
    expect(getFrameState(850).x).toEqual(200);
    expect(getFrameState(900).x).toEqual(400);
    expect(getFrameState(950).x).toEqual(190);
    expect(getFrameState(1000).x).toEqual(200);
  });

  test("result#length is correct for a simple multilayer track", () => {
    const { length } = gen(sampleMultiTrack1, sampleMultiDefaults1);
    expect(length).toEqual(1000);
  });

  test("result#length is correct when endBehavior is continue", () => {
    const { length } = gen(sampleTrack1, sampleDefaults1, {
      endBehavior: "continue"
    });
    expect(length).toEqual(1500);
  });

  test("result#length is correct when endBehavior is stop", () => {
    const { length } = gen(sampleTrack1, sampleDefaults1, {
      endBehavior: "stop"
    });
    expect(length).toEqual(1500);
  });

  test("result#length is correct when endBehavior is loop", () => {
    const { length } = gen(sampleTrack1, sampleDefaults1, {
      endBehavior: "loop"
    });
    expect(length).toEqual(1500);
  });

  test("result#length is doubled when endBehavior is boomerang", () => {
    const { length } = gen(sampleTrack1, sampleDefaults1, {
      endBehavior: "boomerang"
    });
    expect(length).toEqual(3000);
  });

  test("result#getFrameState successfully boomerangs state values", () => {
    const { getFrameState } = gen(sampleTrack1, sampleDefaults1, {
      endBehavior: "boomerang",
      easing: easeLinear
    });

    expect(getFrameState(0).y).toEqual(10);
    expect(getFrameState(750).y).toEqual(105);
    expect(getFrameState(1300).y).toBeCloseTo(174.666);
    expect(getFrameState(1500).y).toEqual(200);
    expect(getFrameState(1700).y).toBeCloseTo(174.666);
    expect(getFrameState(2250).y).toEqual(105);
    expect(getFrameState(3000).y).toEqual(10);
  });

  test("result#getFrameState successfully loops state values", () => {
    const { getFrameState } = gen(sampleTrack1, sampleDefaults1, {
      endBehavior: "loop",
      easing: easeLinear
    });

    expect(getFrameState(0).y).toEqual(10);
    expect(getFrameState(750).y).toEqual(105);
    expect(getFrameState(1300).y).toBeCloseTo(174.666);
    expect(getFrameState(1500).y).toEqual(10);
    expect(getFrameState(1700).y).toBeCloseTo(35.333);
    expect(getFrameState(2250).y).toEqual(105);
    expect(getFrameState(3000).y).toEqual(10);
  });

  test("result#getFrameState resolves the correct values for a multi track with separate variables", () => {
    const { getFrameState } = gen(sampleMultiTrack2, sampleMultiDefaults2, {
      easing: easeLinear
    });

    expect(getFrameState(0)).toEqual({
      x1: 0,
      x2: 0,
      x3: 0,
      x4: 0
    });
    expect(getFrameState(100)).toEqual({
      x1: 10,
      x2: 0,
      x3: 0,
      x4: 0
    });
    expect(getFrameState(200)).toEqual({
      x1: 20,
      x2: 0,
      x3: 0,
      x4: 0
    });
    expect(getFrameState(300)).toEqual({
      x1: 30,
      x2: 0,
      x3: 0,
      x4: 0
    });
    expect(getFrameState(400)).toEqual({
      x1: 40,
      x2: 10,
      x3: 0,
      x4: 0
    });
    expect(getFrameState(600)).toEqual({
      x1: 60,
      x2: 30,
      x3: 0,
      x4: 0
    });
    expect(getFrameState(800)).toEqual({
      x1: 80,
      x2: 50,
      x3: 0,
      x4: 0
    });
    expect(getFrameState(1000)).toEqual({
      x1: 100,
      x2: 70,
      x3: 20,
      x4: 10
    });
    expect(getFrameState(1300)).toEqual({
      x1: 100,
      x2: 100,
      x3: 50,
      x4: 40
    });
    expect(getFrameState(1600)).toEqual({
      x1: 100,
      x2: 100,
      x3: 80,
      x4: 70
    });
    expect(getFrameState(1900)).toEqual({
      x1: 100,
      x2: 100,
      x3: 100,
      x4: 100
    });
    expect(getFrameState(2000)).toEqual({
      x1: 100,
      x2: 100,
      x3: 100,
      x4: 100
    });
  });

  test("allows an empty track as input", () => {
    const { getFrameState, length } = gen([], sampleDefaults1);

    expect(length).toEqual(0);
    expect(getFrameState(0)).toEqual(sampleDefaults1);
    expect(getFrameState(100)).toEqual(sampleDefaults1);
  });

  test("result#getFrameState resolve the correct values for a simple boomerang track", () => {
    const { getFrameState } = gen(
      [{ layer: "1", duration: 1000, state: { x: { to: 10 } } }],
      { x: 0 },
      { endBehavior: "boomerang", easing: easeLinear }
    );
    expect(getFrameState(1000)).toEqual({ x: 10 });
    expect(getFrameState(1250)).toEqual({ x: 7.5 });
  });

  test("result#getFrameState resolve the correct values for a boomerang track with an underlying layer", () => {
    const { getFrameState } = gen(
      [
        { layer: "1", duration: 1000, state: { x: { to: 10 } } },
        { layer: "0", duration: 1000, state: { x: { to: 0 } } }
      ],
      { x: 0 },
      { endBehavior: "boomerang", easing: easeLinear }
    );
    expect(getFrameState(1000)).toEqual({ x: 10 });
    expect(getFrameState(1250)).toEqual({ x: 7.5 });
  });

  test("throws an error if an atom includes 'relativeTime'", () => {
    expect(() => {
      gen(
        [
          {
            duration: 1000,
            relativeTime: true
          }
        ],
        { x: 0 }
      );
    }).toThrowError();
  });

  describe("Looping", () => {
    test("result#length is the length of the longest active track, not taking a passive loop into account", () => {
      const { length } = gen(sampleMultiTrack3, sampleMultiDefaults3);
      expect(length).toEqual(2000);
    });

    test("result#length is the length of the longest active track, so an active loop's length is considered", () => {
      const track = sampleMultiTrack3;
      track[0] = {
        ...track[0],
        loop: {
          count: 3, // duration 1000 x4
          boomerang: false
        }
      };
      const { length } = gen(sampleMultiTrack3, sampleMultiDefaults3);
      expect(length).toEqual(4000);
    });

    test("result#length is the length of the longest active track, so an active (boomerang) loop's length is considered", () => {
      const track = sampleMultiTrack3;
      track[0] = {
        ...track[0],
        loop: {
          count: 3,
          boomerang: true
        }
      };
      const { length } = gen(sampleMultiTrack3, sampleMultiDefaults3);
      expect(length).toEqual(8000);
    });

    test("result#length is correct for a boomerang (count) loop", () => {
      const track = [
        {
          state: {
            x: { to: 1 }
          },
          loop: {
            count: 3,
            boomerang: true
          },
          duration: 1000
        }
      ];

      const { length } = gen(track, { x: 0 });
      expect(length).toEqual(8000);
    });

    test("result#getFrameState resolves the correct values for a track with a (passive) loop", () => {
      const track = sampleMultiTrack3;
      track[0] = {
        ...track[0],
        loop: true
      };

      const { getFrameState } = gen(track, sampleMultiDefaults3, {
        easing: easeLinear
      });

      expect(getFrameState(0)).toEqual(sampleMultiDefaults3);
      expect(getFrameState(500)).toEqual({
        x: 0.5,
        y: 0
      });
      expect(getFrameState(999)).toEqual({
        x: 0.999,
        y: 0
      });
      expect(getFrameState(1000)).toEqual({
        x: 0,
        y: 0
      });
      expect(getFrameState(1500)).toEqual({
        x: 0.5,
        y: 0.5
      });
      expect(getFrameState(1999)).toEqual({
        x: 0.999,
        y: 0.999
      });
      expect(getFrameState(2000)).toEqual({
        x: 0,
        y: 1
      });
    });

    test("result#getFrameState resolves the correct values for a track with a (passive, boomerang) loop", () => {
      const track = sampleMultiTrack3;
      track[0] = {
        ...track[0],
        loop: {
          boomerang: true
        }
      };

      const { getFrameState } = gen(track, sampleMultiDefaults3, {
        easing: easeLinear
      });

      expect(getFrameState(0)).toEqual(sampleMultiDefaults3);
      expect(getFrameState(500)).toEqual({
        x: 0.5,
        y: 0
      });
      expect(getFrameState(999)).toEqual({
        x: 0.999,
        y: 0
      });
      expect(getFrameState(1000)).toEqual({
        x: 1,
        y: 0
      });
      expect(getFrameState(1500)).toEqual({
        x: 0.5,
        y: 0.5
      });
      expect(getFrameState(1999)).toEqual({
        x: 0.001,
        y: 0.999
      });
      expect(getFrameState(2000)).toEqual({
        x: 0,
        y: 1
      });
    });
  });

  describe("Grouping", () => {
    const sampleGroupTrack1: ITrackRegion[] = [
      {
        layer: "1",
        duration: 1000,
        state: { x: { to: 10 } }
      },
      {
        layer: "0",
        regions: [
          {
            duration: 500,
            state: { y: { to: 10 } }
          },
          {
            duration: 500,
            state: { y: { to: 0 } }
          }
        ]
      }
    ];
    const sampleGroupDefaults1 = {
      x: 0,
      y: 0
    };

    const sampleGroupTrack2 = (loop: ILoopConfig | boolean): ITrackRegion[] => [
      {
        layer: "1",
        duration: 1000,
        state: { x: { to: 10 } }
      },
      {
        layer: "0",
        regions: [
          {
            duration: 500,
            state: { y: { to: 10 } }
          },
          {
            duration: 500,
            state: { y: { to: 0 } }
          }
        ],
        loop
      }
    ];
    const sampleGroupDefaults2 = {
      x: 0,
      y: 0
    };

    test("result#length is correct for group", () => {
      const animation = gen(sampleGroupTrack1, sampleGroupDefaults1);
      expect(animation.length).toEqual(1000);
    });

    test("result#getFrameState resolves the correct values for a group", () => {
      const { getFrameState } = gen(sampleGroupTrack1, sampleGroupDefaults1, {
        easing: Lib.d3Ease.easeLinear
      });

      expect(getFrameState(0)).toEqual(sampleGroupDefaults1);
      expect(getFrameState(100)).toEqual({ x: 1, y: 2 });
      expect(getFrameState(250)).toEqual({ x: 2.5, y: 5 });
      expect(getFrameState(500)).toEqual({ x: 5, y: 10 });
      expect(getFrameState(750)).toEqual({ x: 7.5, y: 5 });
      expect(getFrameState(1000)).toEqual({ x: 10, y: 0 });
    });

    test("result#getFrameState resolves 'continue' master end condition for a group correctly", () => {
      const { getFrameState } = gen(sampleGroupTrack1, sampleGroupDefaults1, {
        easing: Lib.d3Ease.easeLinear,
        endBehavior: "continue"
      });
      expect(getFrameState(1000)).toEqual({ x: 10, y: 0 });
      expect(getFrameState(1500)).toEqual({ x: 10, y: 0 });
    });

    test("result#getFrameState resolves 'stop' master end condition for a group correctly", () => {
      const { getFrameState } = gen(sampleGroupTrack1, sampleGroupDefaults1, {
        easing: Lib.d3Ease.easeLinear,
        endBehavior: "stop"
      });
      expect(getFrameState(1000)).toEqual({ x: 10, y: 0 });
      expect(getFrameState(1500)).toEqual({ x: 10, y: 0 });
    });

    test("result#getFrameState resolves 'loop' master end condition for a group correctly", () => {
      const { getFrameState } = gen(sampleGroupTrack1, sampleGroupDefaults1, {
        easing: Lib.d3Ease.easeLinear,
        endBehavior: "loop"
      });
      expect(getFrameState(1000)).toEqual({ x: 0, y: 0 });
      expect(getFrameState(1250)).toEqual({ x: 2.5, y: 5 });
    });

    test("result#getFrameState resolves 'boomerang' master end condition for a group correctly", () => {
      const { getFrameState } = gen(sampleGroupTrack1, sampleGroupDefaults1, {
        easing: Lib.d3Ease.easeLinear,
        endBehavior: "boomerang"
      });
      expect(getFrameState(1000)).toEqual({ x: 10, y: 0 });
      expect(getFrameState(1250)).toEqual({ x: 7.5, y: 5 });
    });

    test("result#length is correct for group with a (passive) loop", () => {
      const { length } = gen(sampleGroupTrack2(true), sampleMultiDefaults2);
      expect(length).toEqual(1000);
    });

    test("result#getFrameState resolves correctly for group with a (passive) loop", () => {
      const { getFrameState } = gen(
        sampleGroupTrack2(true),
        sampleGroupDefaults2,
        { easing: easeLinear, endBehavior: "continue" }
      );
      expect(getFrameState(0)).toEqual({ x: 0, y: 0 });
      expect(getFrameState(1000)).toEqual({ x: 10, y: 0 });

      // TODO - MUSTFIX: This will be 0 once the activeVars issue in parseGroup is fixed.
      const expectedX = 0;

      expect(getFrameState(1250)).toEqual({ x: expectedX, y: 5 });
      expect(getFrameState(1500)).toEqual({ x: expectedX, y: 10 });
      expect(getFrameState(2000)).toEqual({ x: expectedX, y: 0 });
    });

    test("result#length is correct for group with a (active, count) loop", () => {
      const { length } = gen(
        sampleGroupTrack2({ count: 2 }),
        sampleMultiDefaults2
      );
      expect(length).toEqual(3000);
    });

    test("result#getFrameState resolves correctly for group with a (active, count) loop", () => {
      const { getFrameState } = gen(
        sampleGroupTrack2({ count: 2 }),
        sampleGroupDefaults2,
        { easing: easeLinear, endBehavior: "continue" }
      );
      expect(getFrameState(0)).toEqual({ x: 0, y: 0 });
      expect(getFrameState(1000)).toEqual({ x: 10, y: 0 });

      // TODO - MUSTFIX: This will be 0 once the activeVars issue in parseGroup is fixed.
      const expectedX = 0;

      expect(getFrameState(1250)).toEqual({ x: expectedX, y: 5 });
      expect(getFrameState(1500)).toEqual({ x: expectedX, y: 10 });
      expect(getFrameState(2500)).toEqual({ x: expectedX, y: 10 });
      expect(getFrameState(3500)).toEqual({ x: expectedX, y: 0 });
    });

    test("throws an error if a group includes 'state'", () => {
      expect(() => {
        gen(
          [
            {
              regions: [{ duration: 1000 }],
              state: { x: { to: 1 } }
            }
          ],
          { x: 0 }
        );
      }).toThrowError();
    });

    test("throws an error if a group includes 'duration'", () => {
      expect(() => {
        gen(
          [
            {
              regions: [{ duration: 1000 }],
              duration: 800
            }
          ],
          { x: 0 }
        );
      }).toThrowError();
    });

    const sampleGroupTrack3 = (relativeTime?: boolean): ITrackRegion[] => [
      {
        duration: 1000,
        state: { x: { to: 10 } }
      },
      {
        regions: [
          {
            start: 2000,
            duration: 1000,
            state: { y: { to: 10 } }
          },
          {
            duration: 1000,
            state: { y: { to: 0 } }
          }
        ],
        relativeTime
      }
    ];
    const sampleGroupDefaults3 = {
      x: 0,
      y: 0
    };

    test("result#length is correct for a delayed group with default relativeTime setting (false)", () => {
      const { length } = gen(sampleGroupTrack3(), sampleGroupDefaults3);
      expect(length).toEqual(4000);
    });

    test("result#length is correct for a delayed group with relativeTime = false", () => {
      const { length } = gen(sampleGroupTrack3(false), sampleGroupDefaults3);
      expect(length).toEqual(4000);
    });

    test("result#length is correct for a delayed group with relativeTime = true", () => {
      const { length } = gen(sampleGroupTrack3(true), sampleGroupDefaults3);
      expect(length).toEqual(5000);
    });

    test("result#getFrameState resolves correct state for a delayed group with default relativeTime setting (false)", () => {
      const { getFrameState } = gen(sampleGroupTrack3(), sampleGroupDefaults3, {
        easing: easeLinear
      });
      expect(getFrameState(2000)).toEqual({ x: 10, y: 0 });
      expect(getFrameState(2500)).toEqual({ x: 10, y: 5 });
      expect(getFrameState(3000)).toEqual({ x: 10, y: 10 });
      expect(getFrameState(4000)).toEqual({ x: 10, y: 0 });
    });

    test("result#getFrameState resolves correct state for a delayed group with relativeTime = true", () => {
      const { getFrameState } = gen(
        sampleGroupTrack3(true),
        sampleGroupDefaults3,
        {
          easing: easeLinear
        }
      );
      expect(getFrameState(2000)).toEqual({ x: 10, y: 0 });
      expect(getFrameState(2500)).toEqual({ x: 10, y: 0 });
      expect(getFrameState(3000)).toEqual({ x: 10, y: 0 });
      expect(getFrameState(3500)).toEqual({ x: 10, y: 5 });
      expect(getFrameState(4000)).toEqual({ x: 10, y: 10 });
      expect(getFrameState(5000)).toEqual({ x: 10, y: 0 });
    });
  });
});
