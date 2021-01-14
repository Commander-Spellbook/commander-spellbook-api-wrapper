import parseCardQuery from "../../../src/parse-query/parse-card-query";

import type { SearchParameters } from "../../../src/types";

describe("parseCardQuery", () => {
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

  it.each(["=", ":"])("supports %s operator for card names", (operator) => {
    parseCardQuery(
      searchParams,
      "card",
      operator,
      "Rashmi, Eternities Crafter"
    );

    expect(searchParams).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          sizeFilters: [],
          excludeFilters: [],
          includeFilters: [
            {
              method: operator,
              value: "Rashmi, Eternities Crafter",
            },
          ],
        },
      })
    );
  });

  it.each(["=", ":"])("supports %s operator for -card names", (operator) => {
    parseCardQuery(
      searchParams,
      "-card",
      operator,
      "Rashmi, Eternities Crafter"
    );

    expect(searchParams).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          sizeFilters: [],
          includeFilters: [],
          excludeFilters: [
            {
              method: operator,
              value: "Rashmi, Eternities Crafter",
            },
          ],
        },
      })
    );
  });

  it.each([">", ">=", "<", "<="])(
    "does not support %s operator for card name values in card params",
    (operator) => {
      parseCardQuery(searchParams, "card", operator, "foo");

      expect(searchParams).toEqual(
        expect.objectContaining({
          errors: [
            {
              key: "card",
              value: "foo",
              message: `Operator ${operator} is not compatible with key "card" and value "foo"`,
            },
          ],
          cards: {
            includeFilters: [],
            excludeFilters: [],
            sizeFilters: [],
          },
        })
      );
    }
  );

  it.each([">", ">=", "=", "<", "<="])(
    "supports %s operator for number values in card params",
    (operator) => {
      parseCardQuery(searchParams, "card", operator, "3");

      expect(searchParams).toEqual(
        expect.objectContaining({
          errors: [],
          cards: {
            includeFilters: [],
            excludeFilters: [],
            sizeFilters: [
              {
                method: operator,
                value: 3,
              },
            ],
          },
        })
      );
    }
  );

  it("does not support : operator for number values in card params", () => {
    parseCardQuery(searchParams, "card", ":", "3");

    expect(searchParams).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          includeFilters: [
            {
              method: ":",
              value: "3",
            },
          ],
          excludeFilters: [],
          sizeFilters: [],
        },
      })
    );
  });

  it.each(["=", ">", ">=", "<", "<="])(
    "does not support size operator %s for -card key",
    (operator) => {
      parseCardQuery(searchParams, "-card", operator, "3");

      expect(searchParams).toEqual(
        expect.objectContaining({
          errors: [
            {
              key: "-card",
              value: "3",
              message: `The key "-card" does not support operator "${operator}"`,
            },
          ],
          cards: {
            includeFilters: [],
            excludeFilters: [],
            sizeFilters: [],
          },
        })
      );
    }
  );
});
