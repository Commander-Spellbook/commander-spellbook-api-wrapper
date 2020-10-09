import ColorIdentity from "../../src/models/color-identity";
import Card from "../../src/models/card";
import SpellbookList from "../../src/models/list";
import filterByColorIdentity from "../../src/filter-by-color-identity";

function makeCombo(colorIdentity: string) {
  return {
    commanderSpellbookId: 1,
    permalink: "https://commanderspellbook.com/?id=1",
    cards: [new Card("card 1"), new Card("card 2")],
    colorIdentity: new ColorIdentity(colorIdentity),
    prerequisites: SpellbookList.create(""),
    steps: SpellbookList.create(""),
    result: SpellbookList.create(""),
  };
}

function makeColorIdentityCombos() {
  return [makeCombo("r,g"), makeCombo("c"), makeCombo("w,u,b,r,g")];
}

describe("filterByColorIdentity", () => {
  it("resolves with only combos that encompass the specified color identity", async () => {
    const combos = filterByColorIdentity(
      ["r", "g", "w"],
      makeColorIdentityCombos()
    );

    expect(combos.length).toBe(2);
    expect(combos[0].colorIdentity.colors).toEqual(["r", "g"]);
    expect(combos[1].colorIdentity.colors).toEqual(["c"]);
  });

  it("resolves with only colorless combos when specified", async () => {
    const combos = filterByColorIdentity(["c"], makeColorIdentityCombos());

    expect(combos.length).toBe(1);
    expect(combos[0].colorIdentity.colors).toEqual(["c"]);
  });

  it("resolves with all combos when wubrg is specified", async () => {
    const combos = filterByColorIdentity(
      ["w", "u", "b", "r", "g"],
      makeColorIdentityCombos()
    );

    expect(combos.length).toBe(3);
    expect(combos[0].colorIdentity.colors).toEqual(["r", "g"]);
    expect(combos[1].colorIdentity.colors).toEqual(["c"]);
    expect(combos[2].colorIdentity.colors).toEqual(["w", "u", "b", "r", "g"]);
  });

  it("handles specifying 'c' along with other colors", async () => {
    const combos = filterByColorIdentity(
      ["r", "g", "c"],
      makeColorIdentityCombos()
    );

    expect(combos.length).toBe(2);
    expect(combos[0].colorIdentity.colors).toEqual(["r", "g"]);
    expect(combos[1].colorIdentity.colors).toEqual(["c"]);
  });
});
