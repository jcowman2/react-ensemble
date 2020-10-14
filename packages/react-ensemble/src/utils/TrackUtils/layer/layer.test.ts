import { layer } from "./layer";

describe("TrackUtils.layer()", () => {
  test("applies a layer to a single object", () => {
    expect(layer("test", { start: 1000 })).toEqual({
      layer: "test",
      start: 1000
    });
  });

  test("applies a layer to an array", () => {
    expect(layer("test", [{ start: 1000 }, { duration: 500 }])).toEqual([
      {
        layer: "test",
        start: 1000
      },
      { layer: "test", duration: 500 }
    ]);
  });

  test("converts number layer names into strings", () => {
    expect(layer(0, { start: 1000 })).toEqual({ layer: "0", start: 1000 });
    expect(layer(100, { start: 1000 })).toEqual({ layer: "100", start: 1000 });
  });
});
