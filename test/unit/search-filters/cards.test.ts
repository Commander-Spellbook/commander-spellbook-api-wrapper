import filterCards from "../../../src/search-filters/cards";
import makeFakeCombo from "../../../src/make-fake-combo";

import { mocked } from "ts-jest/utils";

import type {
  FormattedApiResponse,
  SearchParameters,
} from "../../../src/types";

describe("cards", () => {
  let combos: FormattedApiResponse[];
  let params: SearchParameters;

  beforeEach(() => {
    combos = [makeFakeCombo()];
    params = {
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
        includeFilters: [],
        excludeFilters: [],
        sizeFilters: [],
      },
      steps: {
        includeFilters: [],
        excludeFilters: [],
        sizeFilters: [],
      },
      results: {
        includeFilters: [],
        excludeFilters: [],
        sizeFilters: [],
      },
      errors: [],
    };
  });

  it("includes cards", () => {
    params.cards.includeFilters.push({
      method: ":",
      value: "data",
    });

    const cards = combos[0].cards;
    jest.spyOn(cards, "includesValue").mockReturnValue(true);

    let result = filterCards(combos, params);

    expect(result.length).toBe(1);

    mocked(cards.includesValue).mockReturnValue(false);
    result = filterCards(combos, params);

    expect(result.length).toBe(0);
  });

  it("includes combo only if all filters pass", () => {
    params.cards.includeFilters.push(
      {
        method: ":",
        value: "data 1",
      },
      {
        method: ":",
        value: "data 2",
      },
      {
        method: ":",
        value: "data 3",
      },
      {
        method: ":",
        value: "data 4",
      }
    );
    const cards = combos[0].cards;

    jest.spyOn(cards, "includesValue").mockReturnValue(true);

    let result = filterCards(combos, params);

    expect(result.length).toBe(1);
    expect(cards.includesValue).toBeCalledTimes(4);
    expect(cards.includesValue).toBeCalledWith("data 1");
    expect(cards.includesValue).toBeCalledWith("data 2");
    expect(cards.includesValue).toBeCalledWith("data 3");
    expect(cards.includesValue).toBeCalledWith("data 4");

    mocked(cards.includesValue).mockReset();
    mocked(cards.includesValue).mockReturnValueOnce(true);
    mocked(cards.includesValue).mockReturnValueOnce(true);
    mocked(cards.includesValue).mockReturnValueOnce(false);

    result = filterCards(combos, params);

    expect(result.length).toBe(0);

    expect(cards.includesValue).toBeCalledTimes(3);
    expect(cards.includesValue).toBeCalledWith("data 1");
    expect(cards.includesValue).toBeCalledWith("data 2");
    expect(cards.includesValue).toBeCalledWith("data 3");
  });

  it("excludes cards", () => {
    params.cards.excludeFilters.push({
      method: ":",
      value: "data",
    });

    const cards = combos[0].cards;
    jest.spyOn(cards, "includesValue").mockReturnValue(false);

    let result = filterCards(combos, params);

    expect(result.length).toBe(1);

    mocked(cards.includesValue).mockReturnValue(true);
    result = filterCards(combos, params);

    expect(result.length).toBe(0);
  });

  it("exludes combo if any filters pass", () => {
    params.cards.excludeFilters.push(
      {
        method: ":",
        value: "data 1",
      },
      {
        method: ":",
        value: "data 2",
      },
      {
        method: ":",
        value: "data 3",
      },
      {
        method: ":",
        value: "data 4",
      }
    );
    const cards = combos[0].cards;

    jest.spyOn(cards, "includesValue").mockReturnValue(false);

    let result = filterCards(combos, params);

    expect(result.length).toBe(1);
    expect(cards.includesValue).toBeCalledTimes(4);
    expect(cards.includesValue).toBeCalledWith("data 1");
    expect(cards.includesValue).toBeCalledWith("data 2");
    expect(cards.includesValue).toBeCalledWith("data 3");
    expect(cards.includesValue).toBeCalledWith("data 4");

    mocked(cards.includesValue).mockReset();
    mocked(cards.includesValue).mockReturnValueOnce(false);
    mocked(cards.includesValue).mockReturnValueOnce(true);

    result = filterCards(combos, params);

    expect(result.length).toBe(0);

    expect(cards.includesValue).toBeCalledTimes(2);
    expect(cards.includesValue).toBeCalledWith("data 1");
    expect(cards.includesValue).toBeCalledWith("data 2");
  });
});
