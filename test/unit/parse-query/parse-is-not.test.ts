import parseIsNot from "../../../src/parse-query/parse-is-not";
import { makeSearchParams } from "../helper";

import type { SearchParameters } from "../../../src/types";

const KINDS: ["banned", "spoiled"] = ["banned", "spoiled"];

describe("parseIsNot", () => {
  let searchParams: SearchParameters;

  beforeEach(() => {
    searchParams = makeSearchParams();
  });

  describe.each(KINDS)("%s", (kind) => {
    it(`supports is for ${kind}`, () => {
      parseIsNot(searchParams, "is", ":", kind);

      expect(searchParams.is[kind]).toEqual(true);
    });

    it(`supports -is for ${kind}`, () => {
      parseIsNot(searchParams, "-is", ":", kind);

      expect(searchParams.not[kind]).toEqual(true);
    });

    it(`supports not for ${kind}`, () => {
      parseIsNot(searchParams, "not", ":", kind);

      expect(searchParams.not[kind]).toEqual(true);
    });

    it(`supports -not for ${kind}`, () => {
      parseIsNot(searchParams, "-not", ":", kind);

      expect(searchParams.is[kind]).toEqual(true);
    });

    it.each(["=", ">", "<", "=>", "<="])(
      "errors for operators that are not '%s'",
      (operator) => {
        parseIsNot(searchParams, "is", operator, kind);

        expect(searchParams.errors[0]).toEqual({
          key: "is",
          value: kind,
          message: `The key "is" does not support operator "${operator}".`,
        });
      }
    );
  });

  it("supports previewed as an alias for 'spoiled'", () => {
    parseIsNot(searchParams, "is", ":", "previewed");

    expect(searchParams.is.spoiled).toBe(true);
  });
});
