import random from "../../src/random";
import lookup from "../../src/spellbook-api";
import CardGrouping from "../../src/models/card-grouping";
import SpellbookList from "../../src/models/list";
import ColorIdentity from "../../src/models/color-identity";

import type { FormattedApiResponse } from "../../src/types";

import { mocked } from "ts-jest/utils";
jest.mock("../../src/spellbook-api");

describe("random", () => {
  let combos: FormattedApiResponse[];

  beforeEach(() => {
    combos = [
      {
        commanderSpellbookId: "1",
        permalink: "https://commanderspellbook.com/?id=1",
        cards: CardGrouping.create(["Card 1", "Card 2"]),
        colorIdentity: new ColorIdentity("r,g"),
        prerequisites: SpellbookList.create("Step 1. Step 2"),
        steps: SpellbookList.create("Step 1. Step 2"),
        results: SpellbookList.create("Step 1. Step 2"),
      },
      {
        commanderSpellbookId: "2",
        permalink: "https://commanderspellbook.com/?id=2",
        cards: CardGrouping.create(["Card 3", "Card 4"]),
        colorIdentity: new ColorIdentity("w,b,r"),
        prerequisites: SpellbookList.create("Step 1. Step 2"),
        steps: SpellbookList.create("Step 1. Step 2"),
        results: SpellbookList.create("Step 1. Step 2"),
      },
    ];
    mocked(lookup).mockResolvedValue(combos);
  });

  it("looks up combos from api", async () => {
    await random();

    expect(lookup).toBeCalledTimes(1);
  });

  it("returns a random combo", async () => {
    jest.spyOn(Math, "floor");
    jest.spyOn(Math, "random");

    const combo = await random();

    expect(combos).toContain(combo);
    expect(Math.floor).toBeCalledTimes(1);
    expect(Math.random).toBeCalledTimes(1);
  });
});
