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

  it("handles malformed color idenitity strings", async () => {
    const ci = new ColorIdentity("w,u,");

    expect(ci.colors).toEqual(["w", "u"]);
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
