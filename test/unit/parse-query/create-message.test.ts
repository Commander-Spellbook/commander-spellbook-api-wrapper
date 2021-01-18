import createMessage, {
  DATA_TYPES,
} from "../../../src/parse-query/create-message";
import makeFakeCombo from "../../../src/make-fake-combo";

import type {
  SearchParameters,
  FormattedApiResponse,
} from "../../../src/types";

describe("createMessage", () => {
  let combos: FormattedApiResponse[];
  let searchParams: SearchParameters;

  beforeEach(() => {
    combos = [makeFakeCombo()];
    searchParams = {
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

  it("adds number combos to font of message", () => {
    expect(createMessage(combos, searchParams)).toMatch(/^1 combo where/);

    combos.push(makeFakeCombo(), makeFakeCombo(), makeFakeCombo());

    expect(createMessage(combos, searchParams)).toMatch(/^4 combos where/);
  });

  describe.each(DATA_TYPES)("%s", (dataType) => {
    it(`creates a message for number of ${dataType}`, () => {
      searchParams[dataType].sizeFilters.push(
        {
          method: ">",
          value: 5,
        },
        {
          method: "=",
          value: 4,
        },
        {
          method: "<=",
          value: 2,
        }
      );

      const message = createMessage(combos, searchParams);

      expect(message).toContain(
        `the number of ${dataType} is greater than 5 and the number of ${dataType} equals 4 and the number of ${dataType} is less than or equal to 2`
      );
    });

    it(`creates a message for data included in ${dataType}`, () => {
      searchParams[dataType].includeFilters.push(
        {
          method: ":",
          value: "data 1",
        },
        {
          method: "=",
          value: "data 2",
        },
        {
          method: ":",
          value: 'data with "quotes"',
        }
      );

      const message = createMessage(combos, searchParams);

      expect(message).toContain(
        `${dataType} have a value containing "data 1" and ${dataType} have a value of exactly "data 2" and ${dataType} have a value containing "data with \\"quotes\\""`
      );
    });

    it(`creates a message for data excluded from ${dataType}`, () => {
      searchParams[dataType].excludeFilters.push(
        {
          method: ":",
          value: "data 1",
        },
        {
          method: "=",
          value: "data 2",
        },
        {
          method: ":",
          value: 'data with "quotes"',
        }
      );

      const message = createMessage(combos, searchParams);

      expect(message).toContain(
        `${dataType} do not have a value containing "data 1" and ${dataType} do not have a value of exactly "data 2" and ${dataType} do not have a value containing "data with \\"quotes\\""`
      );
    });
  });

  describe("color identity", () => {
    it("creates a message for number of colors", () => {
      searchParams.colorIdentity.sizeFilters.push(
        {
          method: ">",
          value: 5,
        },
        {
          method: "=",
          value: 4,
        },
        {
          method: "<=",
          value: 2,
        }
      );

      const message = createMessage(combos, searchParams);

      expect(message).toContain(
        `the number of colors is greater than 5 and the number of colors equals 4 and the number of colors is less than or equal to 2`
      );
    });

    it("creates a message for data included in color identity", () => {
      searchParams.colorIdentity.includeFilters.push(
        {
          method: ":",
          value: ["w", "b"],
        },
        {
          method: "=",
          value: ["r", "b", "w"],
        },
        {
          method: ">",
          value: ["r", "b"],
        }
      );

      const message = createMessage(combos, searchParams);

      expect(message).toContain(
        `colors that are within "wb" and colors that are exactly "rbw" and colors that are greater than "rb"`
      );
    });

    it("creates a message for data excluded from colors", () => {
      searchParams.colorIdentity.excludeFilters.push(
        {
          method: ":",
          value: ["w", "b"],
        },
        {
          method: "=",
          value: ["r", "b", "w"],
        },
        {
          method: ">",
          value: ["r", "b"],
        }
      );

      const message = createMessage(combos, searchParams);

      expect(message).toContain(
        `colors that are not within "wb" and colors that are not exactly "rbw" and colors that are not greater than "rb"`
      );
    });
  });
});
