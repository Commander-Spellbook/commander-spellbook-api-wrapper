import findById from "../../src/find-by-id";
import lookup from "../../src/spellbook-api";
import CardGrouping from "../../src/models/card-grouping";
import SpellbookList from "../../src/models/list";
import ColorIdentity from "../../src/models/color-identity";

import type { FormattedApiResponse } from "../../src/types";

import { mocked } from "ts-jest/utils";
jest.mock("../../src/spellbook-api");

describe("findById", () => {
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

  it("returns the specified combo", async () => {
    const combo1 = await findById("1");
    const combo2 = await findById("2");

    expect(combo1).toBe(combos[0]);
    expect(combo2).toBe(combos[1]);
  });

  it("rejects when combo cannot be found", async () => {
    expect.assertions(1);

    try {
      await findById("not-found-id");
    } catch (err) {
      expect(err.message).toBe(
        'Combo with id "not-found-id" could not be found.'
      );
    }
  });
});
