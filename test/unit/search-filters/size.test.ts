import filterSize, {
  SIZE_RESTRICTED_FILTERS,
} from "../../../src/search-filters/size";
import makeFakeCombo from "../../../src/make-fake-combo";

import { mocked } from "ts-jest/utils";

import type {
  FormattedApiResponse,
  SearchParameters,
} from "../../../src/types";

describe("sizeFilter", () => {
  let combos: FormattedApiResponse[];
  let params: SearchParameters;

  beforeEach(() => {
    combos = [makeFakeCombo()];
    params = {
      id: {
        includeFilters: [],
        excludeFilters: [],
      },
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

  describe.each(SIZE_RESTRICTED_FILTERS)("%s", (dataType) => {
    beforeEach(() => {
      jest.spyOn(combos[0][dataType], "size");
    });

    it.each([":", "="])(
      "can filter by number of values using %s",
      async (operator) => {
        mocked(combos[0][dataType].size).mockReturnValue(3);

        params[dataType].sizeFilters.push({
          method: operator,
          value: 3,
        });

        let result = await filterSize(combos, params);
        expect(result.length).toBe(1);

        mocked(combos[0][dataType].size).mockReturnValue(2);

        result = filterSize(combos, params);
        expect(result.length).toBe(0);

        mocked(combos[0][dataType].size).mockReturnValue(4);

        result = filterSize(combos, params);
        expect(result.length).toBe(0);
      }
    );

    it("can filter by number of values using >", async () => {
      mocked(combos[0][dataType].size).mockReturnValue(4);

      params[dataType].sizeFilters.push({
        method: ">",
        value: 3,
      });

      let result = filterSize(combos, params);
      expect(result.length).toBe(1);

      mocked(combos[0][dataType].size).mockReturnValue(3);

      result = filterSize(combos, params);
      expect(result.length).toBe(0);

      mocked(combos[0][dataType].size).mockReturnValue(2);

      result = filterSize(combos, params);
      expect(result.length).toBe(0);
    });

    it("can filter by number of values using >=", async () => {
      mocked(combos[0][dataType].size).mockReturnValue(4);

      params[dataType].sizeFilters.push({
        method: ">=",
        value: 3,
      });

      let result = filterSize(combos, params);
      expect(result.length).toBe(1);

      mocked(combos[0][dataType].size).mockReturnValue(3);

      result = filterSize(combos, params);
      expect(result.length).toBe(1);

      mocked(combos[0][dataType].size).mockReturnValue(2);

      result = filterSize(combos, params);
      expect(result.length).toBe(0);
    });

    it("can filter by number of values using <", async () => {
      mocked(combos[0][dataType].size).mockReturnValue(2);

      params[dataType].sizeFilters.push({
        method: "<",
        value: 3,
      });

      let result = filterSize(combos, params);
      expect(result.length).toBe(1);

      mocked(combos[0][dataType].size).mockReturnValue(3);

      result = filterSize(combos, params);
      expect(result.length).toBe(0);

      mocked(combos[0][dataType].size).mockReturnValue(4);

      result = filterSize(combos, params);
      expect(result.length).toBe(0);
    });

    it("can filter by number of values using <=", async () => {
      mocked(combos[0][dataType].size).mockReturnValue(2);

      params[dataType].sizeFilters.push({
        method: "<=",
        value: 3,
      });

      let result = filterSize(combos, params);
      expect(result.length).toBe(1);

      mocked(combos[0][dataType].size).mockReturnValue(3);

      result = filterSize(combos, params);
      expect(result.length).toBe(1);

      mocked(combos[0][dataType].size).mockReturnValue(4);

      result = filterSize(combos, params);
      expect(result.length).toBe(0);
    });
  });
});
