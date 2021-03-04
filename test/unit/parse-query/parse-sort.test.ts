import parseSort from "../../../src/parse-query/parse-sort";
import { makeSearchParams } from "../helper";

import type { SearchParameters } from "../../../src/types";

describe("parseSort", () => {
  let searchParams: SearchParameters;

  beforeEach(() => {
    searchParams = makeSearchParams();
  });

  it.each([
    "number-of-results",
    "number-of-steps",
    "number-of-prerequisites",
    "number-of-cards",
    "id",
    "colors",
  ])("suports %s", (kind) => {
    parseSort(searchParams, ":", kind);

    expect(searchParams.sort).toEqual(kind);
  });

  it.each(["results", "steps", "prerequisites", "cards"])(
    "supports %s (as alias)",
    (kind) => {
      parseSort(searchParams, ":", kind);

      expect(searchParams.sort).toEqual(`number-of-${kind}`);
    }
  );

  it.each(["color", "ci", "coloridentity", "color-identity"])(
    "supports %s as alias for colors",
    (kind) => {
      parseSort(searchParams, "=", kind);

      expect(searchParams.sort).toEqual("colors");
    }
  );

  it("provides error if invalid value is used for sort", () => {
    parseSort(searchParams, ":", "foo");

    expect(searchParams.sort).toBeFalsy();
    expect(searchParams.errors[0]).toEqual({
      key: "sort",
      value: "foo",
      message: `Unknown sort option "foo".`,
    });
  });

  it("provides error if sort is already specified", () => {
    parseSort(searchParams, ":", "results");

    parseSort(searchParams, ":", "cards");

    expect(searchParams.sort).toEqual("number-of-results");
    expect(searchParams.errors[0]).toEqual({
      key: "sort",
      value: "cards",
      message: `Sort option "number-of-results" already chosen. Sorting by "cards" will be ignored.`,
    });
  });

  it("provides error if invalid operator is used", () => {
    parseSort(searchParams, ">", "cards");

    expect(searchParams.sort).toBeFalsy();
    expect(searchParams.errors[0]).toEqual({
      key: "sort",
      value: "cards",
      message: `Sort does not support the ">" operator.`,
    });
  });
});
