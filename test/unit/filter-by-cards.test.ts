import Card from "../../src/models/card";
import SpellbookList from "../../src/models/list";
import ColorIdentity from "../../src/models/color-identity";
import filterByCards from "../../src/filter-by-cards";

function makeCombo(cards: string[]) {
  return {
    commanderSpellbookId: 1,
    permalink: "https://commanderspellbook.com/?id=1",
    cards: cards.map((c) => new Card(c)),
    colorIdentity: new ColorIdentity(""),
    prerequisites: SpellbookList.create(""),
    steps: SpellbookList.create(""),
    result: SpellbookList.create(""),
  };
}

function makeArjunBasedCombos() {
  return [
    makeCombo([
      "Arjun, the Shifting Flame",
      "Psychosis Crawler",
      "Teferi's Ageless Insight",
    ]),
    makeCombo([
      "Arjun, the Shifting Flame",
      "Niv Mizzet the Firemind",
      "Alhamarett's Archive",
    ]),
    makeCombo([
      "Arjun, the Shifting Flame",
      "Psychosis Crawler",
      "Alhamarett's Archive",
    ]),
  ];
}

describe("filterByCards", () => {
  it("resolves with only combos that include the specified cards", async () => {
    const combos = filterByCards(["Psychosis Crawler"], makeArjunBasedCombos());

    expect(combos.length).toBe(2);
    expect(combos[0].cards.map((c) => c.name)).toEqual([
      "Arjun, the Shifting Flame",
      "Psychosis Crawler",
      "Teferi's Ageless Insight",
    ]);
    expect(combos[1].cards.map((c) => c.name)).toEqual([
      "Arjun, the Shifting Flame",
      "Psychosis Crawler",
      "Alhamarett's Archive",
    ]);
  });

  it("ignores casing and punctuation", async () => {
    const combos = filterByCards(
      ["alhamaretts archive"],
      makeArjunBasedCombos()
    );

    expect(combos.length).toBe(2);
    expect(combos[0].cards.map((c) => c.name)).toEqual([
      "Arjun, the Shifting Flame",
      "Niv Mizzet the Firemind",
      "Alhamarett's Archive",
    ]);
    expect(combos[1].cards.map((c) => c.name)).toEqual([
      "Arjun, the Shifting Flame",
      "Psychosis Crawler",
      "Alhamarett's Archive",
    ]);
  });

  it("matches partial names", async () => {
    const combos = filterByCards(["niv"], makeArjunBasedCombos());

    expect(combos.length).toBe(1);
    expect(combos[0].cards.map((c) => c.name)).toEqual([
      "Arjun, the Shifting Flame",
      "Niv Mizzet the Firemind",
      "Alhamarett's Archive",
    ]);
  });

  it("resolves with only combos that match all cards passed", async () => {
    const combos = filterByCards(["psyc", "tef"], makeArjunBasedCombos());

    expect(combos.length).toBe(1);
    expect(combos[0].cards.map((c) => c.name)).toEqual([
      "Arjun, the Shifting Flame",
      "Psychosis Crawler",
      "Teferi's Ageless Insight",
    ]);
  });
});
