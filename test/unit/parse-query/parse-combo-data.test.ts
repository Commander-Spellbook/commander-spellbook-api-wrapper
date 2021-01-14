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

  it("ignores when a unsupported key is passed", () => {
    parseComboData(searchParams, "foo", ":", "data");

    expect(searchParams.prerequisites.includeFilters.length).toBe(0);
    expect(searchParams.prerequisites.excludeFilters.length).toBe(0);
    expect(searchParams.steps.includeFilters.length).toBe(0);
    expect(searchParams.steps.excludeFilters.length).toBe(0);
    expect(searchParams.results.includeFilters.length).toBe(0);
    expect(searchParams.results.excludeFilters.length).toBe(0);
  });

  it("adds filters to multiple filter arrays when substring that matches multiples is used for key", () => {
    parseComboData(searchParams, "re", ":", "data");

    expect(searchParams.prerequisites.includeFilters.length).toBe(1);
    expect(searchParams.prerequisites.includeFilters[0]).toEqual({
      method: ":",
      value: "data",
    });
    expect(searchParams.prerequisites.excludeFilters.length).toBe(0);
    expect(searchParams.steps.includeFilters.length).toBe(0);
    expect(searchParams.steps.excludeFilters.length).toBe(0);
    expect(searchParams.results.includeFilters.length).toBe(1);
    expect(searchParams.results.includeFilters[0]).toEqual({
      method: ":",
      value: "data",
    });
    expect(searchParams.results.excludeFilters.length).toBe(0);
  });

  it("adds negative filters to multiple filter arrays when substring that matches multiples is used for key", () => {
    parseComboData(searchParams, "-re", ":", "data");

    expect(searchParams.prerequisites.includeFilters.length).toBe(0);
    expect(searchParams.prerequisites.excludeFilters.length).toBe(1);
    expect(searchParams.prerequisites.excludeFilters[0]).toEqual({
      method: ":",
      value: "data",
    });
    expect(searchParams.steps.includeFilters.length).toBe(0);
    expect(searchParams.steps.excludeFilters.length).toBe(0);
    expect(searchParams.results.includeFilters.length).toBe(0);
    expect(searchParams.results.excludeFilters.length).toBe(1);
    expect(searchParams.results.excludeFilters[0]).toEqual({
      method: ":",
      value: "data",
    });
  });
});
