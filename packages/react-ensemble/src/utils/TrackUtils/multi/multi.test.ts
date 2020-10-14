import { multi } from "./multi";

describe("TrackUtils.multi()", () => {
  test("consolidates a 2D array of regions", () => {
    expect(
      multi([
        [
          {
            duration: 100,
            state: { x: { to: 1 } }
          },
          {
            duration: 200
          }
        ],
        [
          {
            start: 5000
          }
        ]
      ])
    ).toEqual({
      regions: [
        {
          layer: "0",
          duration: 100,
          state: { x: { to: 1 } }
        },
        { layer: "0", duration: 200 },
        { layer: "1", start: 5000 }
      ]
    });
  });

  test("consolidates an array of mixed arrays and objects", () => {
    expect(
      multi([
        [
          {
            duration: 100,
            state: { x: { to: 1 } }
          },
          {
            duration: 200
          }
        ],
        {
          start: 5000
        }
      ])
    ).toEqual({
      regions: [
        {
          layer: "0",
          duration: 100,
          state: { x: { to: 1 } }
        },
        { layer: "0", duration: 200 },
        { layer: "1", start: 5000 }
      ]
    });
  });

  test("consolidates a record object of arrays", () => {
    expect(
      multi({
        test: [
          {
            duration: 100,
            state: { x: { to: 1 } }
          },
          {
            duration: 200
          }
        ],
        woo: [
          {
            start: 5000
          }
        ]
      })
    ).toEqual({
      regions: [
        {
          layer: "test",
          duration: 100,
          state: { x: { to: 1 } }
        },
        { layer: "test", duration: 200 },
        { layer: "woo", start: 5000 }
      ]
    });
  });

  test("consolidates a record object of mixed arrays and objects", () => {
    expect(
      multi({
        test: [
          {
            duration: 100,
            state: { x: { to: 1 } }
          },
          {
            duration: 200
          }
        ],
        woo: {
          start: 5000
        }
      })
    ).toEqual({
      regions: [
        {
          layer: "test",
          duration: 100,
          state: { x: { to: 1 } }
        },
        { layer: "test", duration: 200 },
        { layer: "woo", start: 5000 }
      ]
    });
  });

  test("applies config to the outputted group", () => {
    expect(
      multi(
        {
          test: [
            {
              duration: 100,
              state: { x: { to: 1 } }
            },
            {
              duration: 200
            }
          ],
          woo: {
            start: 5000
          }
        },
        {
          relativeTime: true,
          loop: { count: 1 }
        }
      )
    ).toEqual({
      regions: [
        {
          layer: "test",
          duration: 100,
          state: { x: { to: 1 } }
        },
        { layer: "test", duration: 200 },
        { layer: "woo", start: 5000 }
      ],
      relativeTime: true,
      loop: { count: 1 }
    });
  });
});
