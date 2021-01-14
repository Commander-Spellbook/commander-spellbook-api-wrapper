import filterComboData, {
  DATA_TYPES,
} from "../../../src/search-filters/combo-data";
import makeFakeCombo from "../../../src/make-fake-combo";

import { mocked } from "ts-jest/utils";

import type {
  FormattedApiResponse,
  SearchParameters,
} from "../../../src/types";

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
        sizeFilters: [],
        includeFilters: [],
        excludeFilters: [],
      },
      steps: {
        sizeFilters: [],
        includeFilters: [],
        excludeFilters: [],
      },
      results: {
        sizeFilters: [],
        includeFilters: [],
        excludeFilters: [],
      },
      errors: [],
    };
  });

  describe.each(DATA_TYPES)("%s", (dataType) => {
    it(`includes data for ${dataType}`, () => {
      params[dataType].includeFilters.push({
        method: ":",
        value: "data",
      });

      jest.spyOn(combos[0][dataType], "matchesAll").mockReturnValue(true);

      let result = filterComboData(combos, params);

      expect(result.length).toBe(1);

      mocked(combos[0][dataType].matchesAll).mockReturnValue(false);
      result = filterComboData(combos, params);

      expect(result.length).toBe(0);
    });

    it(`excludes data for ${dataType}`, () => {
      params[dataType].excludeFilters.push({
        method: ":",
        value: "data",
      });

      jest.spyOn(combos[0][dataType], "matchesAny").mockReturnValue(false);

      let result = filterComboData(combos, params);

      expect(result.length).toBe(1);

      mocked(combos[0][dataType].matchesAny).mockReturnValue(true);
      result = filterComboData(combos, params);

      expect(result.length).toBe(0);
    });
  });
});
