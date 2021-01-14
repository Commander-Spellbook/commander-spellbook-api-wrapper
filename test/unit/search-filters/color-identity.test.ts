import filterColorIdentity from "../../../src/search-filters/color-identity";
import ColorIdentity from "../../../src/models/color-identity";
import makeFakeCombo from "../../../src/make-fake-combo";

import { mocked } from "ts-jest/utils";

import type {
  FormattedApiResponse,
  SearchParameters,
} from "../../../src/types";

describe("colorIdentityFilter", () => {
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

  describe("color filter", () => {
    it("can filter by color identity array with : operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "isWithin").mockReturnValue(true);
      jest.spyOn(ColorIdentity.prototype, "is");

      params.colorIdentity.includeFilters.push({
        method: ":",
        value: ["g", "r", "w"],
      });

      let result = filterColorIdentity(combos, params);

      expect(ColorIdentity.prototype.isWithin).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.isWithin).toBeCalledWith(["g", "r", "w"]);
      expect(ColorIdentity.prototype.is).not.toBeCalled();

      expect(result.length).toBe(1);

      jest.spyOn(ColorIdentity.prototype, "isWithin").mockReturnValue(false);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(0);
    });

    it("can filter by color identity array with >= operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "includes").mockReturnValue(true);

      params.colorIdentity.includeFilters.push({
        method: ">=",
        value: ["g", "r", "w"],
      });
      let result = filterColorIdentity(combos, params);

      expect(ColorIdentity.prototype.includes).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.includes).toBeCalledWith(["g", "r", "w"]);

      expect(result.length).toBe(1);

      mocked(ColorIdentity.prototype.includes).mockReturnValue(false);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(0);
    });

    it("can filter by color identity array with > operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "includes").mockReturnValue(true);
      jest.spyOn(ColorIdentity.prototype, "is").mockReturnValue(false);

      params.colorIdentity.includeFilters.push({
        method: ">",
        value: ["g", "r", "w"],
      });
      let result = filterColorIdentity(combos, params);

      expect(ColorIdentity.prototype.includes).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.includes).toBeCalledWith(["g", "r", "w"]);
      expect(ColorIdentity.prototype.is).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.is).toBeCalledWith(["g", "r", "w"]);

      expect(result.length).toBe(1);

      mocked(ColorIdentity.prototype.includes).mockReturnValue(false);
      mocked(ColorIdentity.prototype.is).mockReturnValue(false);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(0);
    });

    it("can filter by color identity array with < operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "isWithin").mockReturnValue(true);
      jest.spyOn(ColorIdentity.prototype, "is").mockReturnValue(false);

      params.colorIdentity.includeFilters.push({
        method: "<",
        value: ["g", "r", "w"],
      });
      let result = filterColorIdentity(combos, params);

      expect(ColorIdentity.prototype.isWithin).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.isWithin).toBeCalledWith(["g", "r", "w"]);
      expect(ColorIdentity.prototype.is).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.is).toBeCalledWith(["g", "r", "w"]);

      expect(result.length).toBe(1);

      mocked(ColorIdentity.prototype.isWithin).mockReturnValue(false);
      mocked(ColorIdentity.prototype.is).mockReturnValue(false);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(0);
    });

    it("can filter by color identity array with <= operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "isWithin").mockReturnValue(true);

      params.colorIdentity.includeFilters.push({
        method: "<=",
        value: ["g", "r", "w"],
      });
      let result = filterColorIdentity(combos, params);

      expect(ColorIdentity.prototype.isWithin).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.isWithin).toBeCalledWith(["g", "r", "w"]);

      expect(result.length).toBe(1);

      mocked(ColorIdentity.prototype.isWithin).mockReturnValue(false);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(0);
    });

    it("can filter by color identity array with = operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "is").mockReturnValue(true);

      params.colorIdentity.includeFilters.push({
        method: "=",
        value: ["g", "r", "w"],
      });
      let result = filterColorIdentity(combos, params);

      expect(ColorIdentity.prototype.is).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.is).toBeCalledWith(["g", "r", "w"]);

      expect(result.length).toBe(1);

      mocked(ColorIdentity.prototype.is).mockReturnValue(false);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(0);
    });
  });

  describe("negative color filter", () => {
    it("can filter out color identity array with : operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "isWithin").mockReturnValue(true);
      jest.spyOn(ColorIdentity.prototype, "is");

      params.colorIdentity.excludeFilters.push({
        method: ":",
        value: ["g", "r", "w"],
      });

      let result = filterColorIdentity(combos, params);

      expect(ColorIdentity.prototype.isWithin).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.isWithin).toBeCalledWith(["g", "r", "w"]);
      expect(ColorIdentity.prototype.is).not.toBeCalled();

      expect(result.length).toBe(0);

      jest.spyOn(ColorIdentity.prototype, "isWithin").mockReturnValue(false);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(1);
    });

    it("can filter out color identity array with >= operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "includes").mockReturnValue(true);

      params.colorIdentity.excludeFilters.push({
        method: ">=",
        value: ["g", "r", "w"],
      });
      let result = filterColorIdentity(combos, params);

      expect(ColorIdentity.prototype.includes).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.includes).toBeCalledWith(["g", "r", "w"]);

      expect(result.length).toBe(0);

      mocked(ColorIdentity.prototype.includes).mockReturnValue(false);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(1);
    });

    it("can filter out color identity array with > operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "includes").mockReturnValue(true);
      jest.spyOn(ColorIdentity.prototype, "is").mockReturnValue(false);

      params.colorIdentity.excludeFilters.push({
        method: ">",
        value: ["g", "r", "w"],
      });
      let result = filterColorIdentity(combos, params);

      expect(ColorIdentity.prototype.includes).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.includes).toBeCalledWith(["g", "r", "w"]);
      expect(ColorIdentity.prototype.is).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.is).toBeCalledWith(["g", "r", "w"]);

      expect(result.length).toBe(0);

      mocked(ColorIdentity.prototype.includes).mockReturnValue(false);
      mocked(ColorIdentity.prototype.is).mockReturnValue(false);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(1);
    });

    it("can filter out color identity array with < operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "isWithin").mockReturnValue(true);
      jest.spyOn(ColorIdentity.prototype, "is").mockReturnValue(false);

      params.colorIdentity.excludeFilters.push({
        method: "<",
        value: ["g", "r", "w"],
      });
      let result = filterColorIdentity(combos, params);

      expect(ColorIdentity.prototype.isWithin).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.isWithin).toBeCalledWith(["g", "r", "w"]);
      expect(ColorIdentity.prototype.is).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.is).toBeCalledWith(["g", "r", "w"]);

      expect(result.length).toBe(0);

      mocked(ColorIdentity.prototype.isWithin).mockReturnValue(false);
      mocked(ColorIdentity.prototype.is).mockReturnValue(false);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(1);
    });

    it("can filter out color identity array with <= operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "isWithin").mockReturnValue(true);

      params.colorIdentity.excludeFilters.push({
        method: "<=",
        value: ["g", "r", "w"],
      });
      let result = filterColorIdentity(combos, params);

      expect(ColorIdentity.prototype.isWithin).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.isWithin).toBeCalledWith(["g", "r", "w"]);

      expect(result.length).toBe(0);

      mocked(ColorIdentity.prototype.isWithin).mockReturnValue(false);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(1);
    });

    it("can filter out color identity array with = operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "is").mockReturnValue(true);

      params.colorIdentity.excludeFilters.push({
        method: "=",
        value: ["g", "r", "w"],
      });
      let result = filterColorIdentity(combos, params);

      expect(ColorIdentity.prototype.is).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.is).toBeCalledWith(["g", "r", "w"]);

      expect(result.length).toBe(0);

      mocked(ColorIdentity.prototype.is).mockReturnValue(false);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(1);
    });
  });

  describe("size filter", () => {
    beforeEach(() => {
      jest.spyOn(ColorIdentity.prototype, "numberOfColors");
    });

    it.each([":", "="])(
      "can filter by color identity number of colors using %s",
      async (operator) => {
        mocked(ColorIdentity.prototype.numberOfColors).mockReturnValue(3);

        params.colorIdentity.sizeFilters.push({
          method: operator,
          value: 3,
        });

        let result = await filterColorIdentity(combos, params);
        expect(result.length).toBe(1);
        expect(result[0].commanderSpellbookId).toBe("1");

        mocked(ColorIdentity.prototype.numberOfColors).mockReturnValue(2);

        result = filterColorIdentity(combos, params);
        expect(result.length).toBe(0);

        mocked(ColorIdentity.prototype.numberOfColors).mockReturnValue(4);

        result = filterColorIdentity(combos, params);
        expect(result.length).toBe(0);
      }
    );

    it("can filter by color identity number of colors using >", async () => {
      mocked(ColorIdentity.prototype.numberOfColors).mockReturnValue(4);

      params.colorIdentity.sizeFilters.push({
        method: ">",
        value: 3,
      });

      let result = filterColorIdentity(combos, params);
      expect(result.length).toBe(1);
      expect(result[0].commanderSpellbookId).toBe("1");

      mocked(ColorIdentity.prototype.numberOfColors).mockReturnValue(3);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(0);

      mocked(ColorIdentity.prototype.numberOfColors).mockReturnValue(2);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(0);
    });

    it("can filter by color identity number of colors using >=", async () => {
      mocked(ColorIdentity.prototype.numberOfColors).mockReturnValue(4);

      params.colorIdentity.sizeFilters.push({
        method: ">=",
        value: 3,
      });

      let result = filterColorIdentity(combos, params);
      expect(result.length).toBe(1);
      expect(result[0].commanderSpellbookId).toBe("1");

      mocked(ColorIdentity.prototype.numberOfColors).mockReturnValue(3);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(1);
      expect(result[0].commanderSpellbookId).toBe("1");

      mocked(ColorIdentity.prototype.numberOfColors).mockReturnValue(2);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(0);
    });

    it("can filter by color identity number of colors using <", async () => {
      mocked(ColorIdentity.prototype.numberOfColors).mockReturnValue(2);

      params.colorIdentity.sizeFilters.push({
        method: "<",
        value: 3,
      });

      let result = filterColorIdentity(combos, params);
      expect(result.length).toBe(1);
      expect(result[0].commanderSpellbookId).toBe("1");

      mocked(ColorIdentity.prototype.numberOfColors).mockReturnValue(3);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(0);

      mocked(ColorIdentity.prototype.numberOfColors).mockReturnValue(4);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(0);
    });

    it("can filter by color identity number of colors using <=", async () => {
      mocked(ColorIdentity.prototype.numberOfColors).mockReturnValue(2);

      params.colorIdentity.sizeFilters.push({
        method: "<=",
        value: 3,
      });

      let result = filterColorIdentity(combos, params);
      expect(result.length).toBe(1);
      expect(result[0].commanderSpellbookId).toBe("1");

      mocked(ColorIdentity.prototype.numberOfColors).mockReturnValue(3);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(1);
      expect(result[0].commanderSpellbookId).toBe("1");

      mocked(ColorIdentity.prototype.numberOfColors).mockReturnValue(4);

      result = filterColorIdentity(combos, params);
      expect(result.length).toBe(0);
    });
  });
});
