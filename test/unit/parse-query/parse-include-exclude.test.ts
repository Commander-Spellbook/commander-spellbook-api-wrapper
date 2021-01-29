import parseIncludeExclude from "../../../src/parse-query/parse-include-exclude";
import { makeSearchParams } from "../helper";

import type { SearchParameters } from "../../../src/types";

const KINDS: ["banned", "spoiled"] = ["banned", "spoiled"];

describe("parseIncludeExclude", () => {
  let searchParams: SearchParameters;

  beforeEach(() => {
    searchParams = makeSearchParams();
  });

  describe.each(KINDS)("%s", (kind) => {
    it(`supports include for ${kind}`, () => {
      parseIncludeExclude(searchParams, "include", ":", kind);

      expect(searchParams.include[kind]).toEqual(true);
    });

    it(`supports -include for ${kind}`, () => {
      parseIncludeExclude(searchParams, "-include", ":", kind);

      expect(searchParams.exclude[kind]).toEqual(true);
    });

    it(`supports exclude for ${kind}`, () => {
      parseIncludeExclude(searchParams, "exclude", ":", kind);

      expect(searchParams.exclude[kind]).toEqual(true);
    });

    it(`supports -exclude for ${kind}`, () => {
      parseIncludeExclude(searchParams, "-exclude", ":", kind);

      expect(searchParams.include[kind]).toEqual(true);
    });

    it.each(["=", ">", "<", "=>", "<="])(
      "errors for operators that are not '%s'",
      (operator) => {
        parseIncludeExclude(searchParams, "include", operator, kind);

        expect(searchParams.errors[0]).toEqual({
          key: "include",
          value: kind,
          message: `The key "include" does not support operator "${operator}".`,
        });
      }
    );
  });

  it("supports previewed as an alias for 'spoiled'", () => {
    parseIncludeExclude(searchParams, "include", ":", "previewed");

    expect(searchParams.include.spoiled).toBe(true);
  });
});
