import makeFakeCombo from "../../src/make-fake-combo";
import search from "../../src/search";
import lookup from "../../src/spellbook-api";
import filterColorIdentity from "../../src/search-filters/color-identity";
import filterComboData from "../../src/search-filters/combo-data";
import filterSize from "../../src/search-filters/size";
import filterIds from "../../src/search-filters/ids";
import filterTags from "../../src/search-filters/tags";
import sortCombos from "../../src/sort-combos";
import parseQuery from "../../src/parse-query";
import { makeSearchParams } from "./helper";

import { mocked } from "ts-jest/utils";

jest.mock("../../src/spellbook-api");
jest.mock("../../src/search-filters/color-identity");
jest.mock("../../src/search-filters/combo-data");
jest.mock("../../src/search-filters/size");
jest.mock("../../src/search-filters/ids");
jest.mock("../../src/search-filters/tags");
jest.mock("../../src/sort-combos");
jest.mock("../../src/parse-query");

describe("search", () => {
  beforeEach(() => {
    const combo = makeFakeCombo({
      commanderSpellbookId: "1",
      cards: ["Card 1", "Card 2"],
      colorIdentity: "r,g",
      prerequisites: ["Step 1. Step 2"],
      steps: ["Step 1. Step 2"],
      results: ["Step 1. Step 2"],
    });
    mocked(lookup).mockResolvedValue([combo]);

    mocked(parseQuery).mockReturnValue(makeSearchParams());
    mocked(filterColorIdentity).mockReturnValue([combo]);
    mocked(filterComboData).mockReturnValue([combo]);
    mocked(filterSize).mockReturnValue([combo]);
    mocked(filterIds).mockReturnValue([combo]);
    mocked(filterTags).mockReturnValue([combo]);
    mocked(sortCombos).mockReturnValue([combo]);
  });

  it("looks up combos from api", async () => {
    await search("");

    expect(lookup).toBeCalledTimes(1);
  });

  it("filters by ids", async () => {
    await search("Sydri Arjun Rashmi");

    expect(filterIds).toBeCalledTimes(1);
  });

  it("filters by color identity", async () => {
    await search("Sydri Arjun Rashmi");

    expect(filterColorIdentity).toBeCalledTimes(1);
  });

  it("filters by combo data", async () => {
    await search("Sydri Arjun Rashmi");

    expect(filterComboData).toBeCalledTimes(1);
  });

  it("filters by size", async () => {
    await search("Sydri Arjun Rashmi");

    expect(filterSize).toBeCalledTimes(1);
  });

  it("filters by tags", async () => {
    await search("Sydri Arjun Rashmi");

    expect(filterTags).toBeCalledTimes(1);
  });

  it("sorts by colors in ascending order by default", async () => {
    await search("Sydri Arjun Rashmi");

    expect(sortCombos).toBeCalledTimes(1);
    expect(sortCombos).toBeCalledWith(expect.anything(), "colors", "ascending");
  });

  it("can sort by specific attributes", async () => {
    mocked(parseQuery).mockReturnValue(
      makeSearchParams({
        sort: "number-of-cards",
        order: "descending",
      })
    );

    await search("Sydri Arjun Rashmi");

    expect(sortCombos).toBeCalledTimes(1);
    expect(sortCombos).toBeCalledWith(
      expect.anything(),
      "number-of-cards",
      "descending"
    );
  });

  it("includes errors", async () => {
    mocked(parseQuery).mockReturnValue(
      makeSearchParams({
        errors: [
          {
            key: "unknownkey",
            value: "value",
            message: 'Could not parse keyword "unknownkey" with value "value"',
          },
          {
            key: "unknownkey2",
            value: "value2",
            message:
              'Could not parse keyword "unknownkey2" with value "value2"',
          },
        ],
      })
    );
    const result = await search(
      "unknownkey:value card:sydri unknownkey2:value2"
    );

    expect(result.errors).toEqual([
      {
        key: "unknownkey",
        value: "value",
        message: 'Could not parse keyword "unknownkey" with value "value"',
      },
      {
        key: "unknownkey2",
        value: "value2",
        message: 'Could not parse keyword "unknownkey2" with value "value2"',
      },
    ]);
  });
});
