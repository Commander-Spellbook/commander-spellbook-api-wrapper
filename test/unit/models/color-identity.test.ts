import ColorIdentity from "../../../src/models/color-identity";

describe("ColorIdentity", () => {
  it("has a colors attribute", () => {
    const ci = new ColorIdentity("w,r,b");

    expect(ci.colors).toEqual(["w", "b", "r"]);
  });

  it("sorts colors in WUBRG order", () => {
    const ci = new ColorIdentity("g,b,r,w,u");

    expect(ci.colors).toEqual(["w", "u", "b", "r", "g"]);
  });

  it("handles colorless in colors", () => {
    const ci = new ColorIdentity("c");

    expect(ci.colors).toEqual(["c"]);
  });

  it("handles passing an empty string as colorless in colors", () => {
    const ci = new ColorIdentity("");

    expect(ci.colors).toEqual(["c"]);
  });

  it("handles passing non-WUBRG colors", () => {
    const ci = new ColorIdentity("abcdefghijklmnopqrstuvwxyz");

    expect(ci.colors).toEqual(["w", "u", "b", "r", "g"]);
  });

  it("handles malformed color idenitity strings", async () => {
    const ci = new ColorIdentity("w,u,");

    expect(ci.colors).toEqual(["w", "u"]);
  });

  describe("hasColors", () => {
    it("returns true when color identity is colorless", () => {
      const ci = new ColorIdentity("c");

      expect(ci.hasColors(["w"])).toBe(true);
    });

    it("returns false when colors greater than passed in color identity", () => {
      const ci = new ColorIdentity("wub");

      expect(ci.hasColors(["w"])).toBe(false);
      expect(ci.hasColors(["w", "u"])).toBe(false);
      expect(ci.hasColors(["b", "u"])).toBe(false);
      expect(ci.hasColors(["w", "b"])).toBe(false);
    });

    it("returns true when colors are a subset of the color identity", () => {
      const ci = new ColorIdentity("wub");

      expect(ci.hasColors(["w", "b", "u"])).toBe(true);
      expect(ci.hasColors(["w", "b", "u", "r"])).toBe(true);
      expect(ci.hasColors(["w", "b", "u", "g"])).toBe(true);
      expect(ci.hasColors(["w", "b", "u", "r", "g"])).toBe(true);
    });
  });

  describe("toString", () => {
    it("returns the original string", () => {
      const ci = new ColorIdentity("g,b,r,w,u");

      expect(ci.toString()).toEqual("g,b,r,w,u");
    });
  });

  describe("toMarkdown", () => {
    it("returns a markdown string", () => {
      const ci = new ColorIdentity("w,r,b");

      expect(ci.toMarkdown()).toEqual(":manaw::manab::manar:");
    });
  });

  describe("toHTML", () => {
    it("returns a document fragment", () => {
      const ci = new ColorIdentity("w,r,b");

      const fragment = ci.toHTML();
      const imgs = fragment.querySelectorAll<HTMLImageElement>("img");

      expect(fragment).toBeInstanceOf(DocumentFragment);

      expect(imgs.length).toBe(3);
      expect(imgs[0].src).toMatch("W.svg");
      expect(imgs[1].src).toMatch("B.svg");
      expect(imgs[2].src).toMatch("R.svg");
    });
  });
});
