import SpellbookList from "../../../src/models/list";

describe("SpellbookList", () => {
  it("has array methods", () => {
    expect.assertions(7);

    const list = SpellbookList.create();

    list.push("a", "b", "c");

    expect(list.length).toBe(3);
    expect(list[0]).toBe("a");
    expect(list[1]).toBe("b");
    expect(list[2]).toBe("c");
    list.forEach((item, index) => {
      expect(item).toBe(list[index]);
    });
  });

  describe("create", () => {
    it("makes a new list from the string, splitting on .", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");

      expect(list.length).toBe(3);
      expect(list[0]).toBe("Step 1");
      expect(list[1]).toBe("Step 2");
      expect(list[2]).toBe("Step 3");
    });
  });

  describe("matchesAll", () => {
    it("returns true if every item matches", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");

      expect(list.matchesAll(["step", "2", "3"])).toBe(true);
    });

    it("returns false if any item does not match", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");

      expect(list.matchesAll(["step", "foo", "2", "3"])).toBe(false);
    });
  });

  describe("matchesAny", () => {
    it("returns true if any item matches", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");

      expect(list.matchesAny(["foo", "step", "bar"])).toBe(true);
    });

    it("returns false if no item matches", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");

      expect(list.matchesAny(["foo", "bar"])).toBe(false);
    });
  });

  describe("toString", () => {
    it("renders as the raw string passed in", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");

      expect(list.toString()).toBe("Step 1. Step 2. Step 3.");
      expect(`pre: ${list} - post`).toBe("pre: Step 1. Step 2. Step 3. - post");
    });
  });
});
