import parseComboData from "../../../src/parse-query/parse-combo-data";

import type { SearchParameters } from "../../../src/types";

describe("parseComboData", () => {
  let searchParams: SearchParameters;

  beforeEach(() => {
    searchParams = {
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

  it("ignores when a unsupported key is passed", () => {
    parseComboData(searchParams, "foo", ":", "data");

    expect(searchParams.prerequisites.include.length).toBe(0);
    expect(searchParams.prerequisites.exclude.length).toBe(0);
    expect(searchParams.steps.include.length).toBe(0);
    expect(searchParams.steps.exclude.length).toBe(0);
    expect(searchParams.results.include.length).toBe(0);
    expect(searchParams.results.exclude.length).toBe(0);
  });

  it("adds filters to multiple filter arrays when substring that matches multiples is used for key", () => {
    parseComboData(searchParams, "re", ":", "data");

    expect(searchParams.prerequisites.include.length).toBe(1);
    expect(searchParams.prerequisites.include[0]).toBe("data");
    expect(searchParams.prerequisites.exclude.length).toBe(0);
    expect(searchParams.steps.include.length).toBe(0);
    expect(searchParams.steps.exclude.length).toBe(0);
    expect(searchParams.results.include.length).toBe(1);
    expect(searchParams.results.include[0]).toBe("data");
    expect(searchParams.results.exclude.length).toBe(0);
  });

  it("adds negative filters to multiple filter arrays when substring that matches multiples is used for key", () => {
    parseComboData(searchParams, "-re", ":", "data");

    expect(searchParams.prerequisites.include.length).toBe(0);
    expect(searchParams.prerequisites.exclude.length).toBe(1);
    expect(searchParams.prerequisites.exclude[0]).toBe("data");
    expect(searchParams.steps.include.length).toBe(0);
    expect(searchParams.steps.exclude.length).toBe(0);
    expect(searchParams.results.include.length).toBe(0);
    expect(searchParams.results.exclude.length).toBe(1);
    expect(searchParams.results.exclude[0]).toBe("data");
  });
});
