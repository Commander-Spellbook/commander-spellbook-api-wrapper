import parseColorIdentity from "../../../src/parse-query/parse-color-identity";

import type { SearchParameters } from "../../../src/types";

describe("parseColorIdentity", () => {
  let searchParams: SearchParameters;

  beforeEach(() => {
    searchParams = {
      cards: {
        sizeFilters: [],
        includeFilters: [],
        excludeFilters: [],
      },
      colorIdentity: {
        valueFilter: {
          method: "none",
          value: [],
        },
        sizeFilter: {
          method: "none",
          value: 5,
        },
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

  it.each([":", "=", ">", "<", ">=", "<="])(
    "parses ci query with number with %s",
    (operator) => {
      parseColorIdentity(searchParams, "ci", operator, "4");

      expect(searchParams).toEqual(
        expect.objectContaining({
          errors: [],
          colorIdentity: {
            valueFilter: {
              method: "none",
              value: [],
            },
            sizeFilter: {
              method: operator,
              value: 4,
            },
          },
        })
      );
    }
  );

  it("ignores color identity when number is greater than 5", () => {
    parseColorIdentity(searchParams, "ci", ":", "6");

    expect(searchParams).toEqual(
      expect.objectContaining({
        errors: [],
        colorIdentity: {
          valueFilter: {
            method: ":",
            value: [],
          },
          sizeFilter: {
            method: "none",
            value: 5,
          },
        },
      })
    );
  });

  it("ignores color identity when number is less than 0", () => {
    parseColorIdentity(searchParams, "ci", ":", "-1");

    expect(searchParams).toEqual(
      expect.objectContaining({
        errors: [],
        colorIdentity: {
          valueFilter: {
            method: ":",
            value: [],
          },
          sizeFilter: {
            method: "none",
            value: 5,
          },
        },
      })
    );
  });

  it.each(["=", ">", ">=", "<", "<="])(
    "supports ci with %s operator",
    (operator) => {
      parseColorIdentity(searchParams, "ci", operator, "gr");

      expect(searchParams).toEqual(
        expect.objectContaining({
          errors: [],
          colorIdentity: {
            valueFilter: {
              method: operator,
              value: ["g", "r"],
            },
            sizeFilter: {
              method: "none",
              value: 5,
            },
          },
        })
      );
    }
  );
});
