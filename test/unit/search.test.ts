import search from "../../src/search";
import lookup from "../../src/spellbook-api";
import filterCards from "../../src/search-filters/cards";
import filterColorIdentity from "../../src/search-filters/color-identity";
import filterComboData from "../../src/search-filters/combo-data";
import parseQuery from "../../src/parse-query";
import CardGrouping from "../../src/models/card-grouping";
import SpellbookList from "../../src/models/list";
import ColorIdentity from "../../src/models/color-identity";

import { mocked } from "ts-jest/utils";

jest.mock("../../src/spellbook-api");
jest.mock("../../src/search-filters/cards");
jest.mock("../../src/search-filters/color-identity");
jest.mock("../../src/search-filters/combo-data");
jest.mock("../../src/parse-query");

describe("search", () => {
  beforeEach(() => {
    const combo = {
      commanderSpellbookId: "1",
      permalink: "https://commanderspellbook.com/?id=1",
      cards: CardGrouping.create(["Card 1", "Card 2"]),
      colorIdentity: new ColorIdentity("r,g"),
      prerequisites: SpellbookList.create("Step 1. Step 2"),
      steps: SpellbookList.create("Step 1. Step 2"),
      results: SpellbookList.create("Step 1. Step 2"),
    };
    mocked(lookup).mockResolvedValue([combo]);

    mocked(parseQuery).mockReturnValue({
      cards: {
        sizeFilters: [],
        includeFilters: [],
        excludeFilters: [],
      },
      colorIdentity: {
        includeFilters: [],
        excludeFilters: [],
        sizeFilters: [],
      },
      prerequisites: {
        include: [],
        exclude: [],
      },
      steps: {
        include: [],
        exclude: [],
      },
      results: {
        include: [],
        exclude: [],
      },
      errors: [],
    });
    mocked(filterCards).mockReturnValue([combo]);
    mocked(filterColorIdentity).mockReturnValue([combo]);
    mocked(filterComboData).mockReturnValue([combo]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("looks up combos from api", async () => {
    await search("");

    expect(lookup).toBeCalledTimes(1);
  });

  it("filters by cards", async () => {
    await search("Sydri Arjun Rashmi");

    expect(filterCards).toBeCalledTimes(1);
  });

  it("filters by color identity", async () => {
    await search("Sydri Arjun Rashmi");

    expect(filterColorIdentity).toBeCalledTimes(1);
  });

  it("filters by combo data", async () => {
    await search("Sydri Arjun Rashmi");

    expect(filterComboData).toBeCalledTimes(1);
  });

  it("includes errors", async () => {
    mocked(parseQuery).mockReturnValue({
      cards: {
        sizeFilters: [],
        includeFilters: [],
        excludeFilters: [],
      },
      colorIdentity: {
        includeFilters: [],
        excludeFilters: [],
        sizeFilters: [],
      },
      prerequisites: {
        include: [],
        exclude: [],
      },
      steps: {
        include: [],
        exclude: [],
      },
      results: {
        include: [],
        exclude: [],
      },
      errors: [
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
      ],
    });
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
