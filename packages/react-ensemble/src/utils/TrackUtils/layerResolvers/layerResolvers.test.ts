import { overrideLast } from "./layerResolvers";

describe("layerResolvers", () => {
  describe("overrideLast", () => {
    test("selects the value with the lowest age", () => {
      const value = overrideLast("foo", [
        { name: "abcd", rank: 1, age: 1000, value: 123 },
        { name: "efgh", rank: 2, age: 500, value: 50 }
      ]);
      expect(value).toEqual(50);
    });

    test("selects the value with the highest rank if multiple have the same age", () => {
      const value = overrideLast("foo", [
        { name: "abcd", rank: 1, age: 1000, value: 123 },
        { name: "efgh", rank: 2, age: 1000, value: 50 },
        { name: "hi", rank: 0, age: 1000, value: 0 }
      ]);
      expect(value).toEqual(50);
    });
  });
});
