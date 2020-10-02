import search from "../../src/search";
import lookup from "../../src/spellbook-api";

import { mocked } from "ts-jest/utils";
jest.mock("../../src/spellbook-api");

function makeCombo(cards: string[]) {
  return {
    commanderSpellbookId: 1,
    permalink: "https://commanderspellbook.com/?id=1",
    cards,
    colorIdentity: [],
    prerequisites: [],
    steps: [],
    result: [],
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

describe("search", () => {
  it("looks up combos from api", async () => {
    await search({
      cards: ["Sydri"],
    });

    expect(lookup).toBeCalledTimes(1);
  });

  it("resolves with only combos that include the specified cards", async () => {
    mocked(lookup).mockResolvedValue(makeArjunBasedCombos());

    const combos = await search({
      cards: ["Psychosis Crawler"],
    });

    expect(combos.length).toBe(2);
    expect(combos[0].cards).toEqual([
      "Arjun, the Shifting Flame",
      "Psychosis Crawler",
      "Teferi's Ageless Insight",
    ]);
    expect(combos[1].cards).toEqual([
      "Arjun, the Shifting Flame",
      "Psychosis Crawler",
      "Alhamarett's Archive",
    ]);
  });

  it("ignores casing and punctuation", async () => {
    mocked(lookup).mockResolvedValue(makeArjunBasedCombos());

    const combos = await search({
      cards: ["alhamaretts archive"],
    });

    expect(combos.length).toBe(2);
    expect(combos[0].cards).toEqual([
      "Arjun, the Shifting Flame",
      "Niv Mizzet the Firemind",
      "Alhamarett's Archive",
    ]);
    expect(combos[1].cards).toEqual([
      "Arjun, the Shifting Flame",
      "Psychosis Crawler",
      "Alhamarett's Archive",
    ]);
  });

  it("matches partial names", async () => {
    mocked(lookup).mockResolvedValue(makeArjunBasedCombos());

    const combos = await search({
      cards: ["niv"],
    });

    expect(combos.length).toBe(1);
    expect(combos[0].cards).toEqual([
      "Arjun, the Shifting Flame",
      "Niv Mizzet the Firemind",
      "Alhamarett's Archive",
    ]);
  });

  it("resolves with only combos that match all cards passed", async () => {
    mocked(lookup).mockResolvedValue(makeArjunBasedCombos());

    const combos = await search({
      cards: ["psyc", "tef"],
    });

    expect(combos.length).toBe(1);
    expect(combos[0].cards).toEqual([
      "Arjun, the Shifting Flame",
      "Psychosis Crawler",
      "Teferi's Ageless Insight",
    ]);
  });
});
