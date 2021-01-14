import filterComboData from "../../../src/search-filters/combo-data";
import makeFakeCombo from "../../../src/make-fake-combo";

import { mocked } from "ts-jest/utils";

import type {
  FormattedApiResponse,
  SearchParameters,
} from "../../../src/types";

const DATA_TYPES = ["prerequisites", "steps", "results"] as [
  "prerequisites",
  "steps",
  "results"
];

describe("comboDataFilter", () => {
  let combos: FormattedApiResponse[];
  let params: SearchParameters;

  beforeEach(() => {
    combos = [makeFakeCombo({ commanderSpellbookId: "1" })];
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
    };
  });

  describe.each(DATA_TYPES)("%s", (dataType) => {
    it(`includes data for ${dataType}`, () => {
      params[dataType].include.push("data");

      jest.spyOn(combos[0][dataType], "matchesAll").mockReturnValue(true);

      let result = filterComboData(combos, params);

      expect(result.length).toBe(1);

      mocked(combos[0][dataType].matchesAll).mockReturnValue(false);
      result = filterComboData(combos, params);

      expect(result.length).toBe(0);
    });

    it(`excludes data for ${dataType}`, () => {
      params[dataType].exclude.push("data");

      jest.spyOn(combos[0][dataType], "matchesAny").mockReturnValue(false);

      let result = filterComboData(combos, params);

      expect(result.length).toBe(1);

      mocked(combos[0][dataType].matchesAny).mockReturnValue(true);
      result = filterComboData(combos, params);

      expect(result.length).toBe(0);
    });
  });
});
