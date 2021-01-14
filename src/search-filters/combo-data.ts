import type { SearchParameters, FormattedApiResponse } from "../types";

export const DATA_TYPES: ["prerequisites", "steps", "results"] = [
  "prerequisites",
  "steps",
  "results",
];

export default function filterComboData(
  combos: FormattedApiResponse[],
  searchParams: SearchParameters
): FormattedApiResponse[] {
  DATA_TYPES.forEach((dataType) => {
    if (searchParams[dataType].includeFilters.length > 0) {
      combos = combos.filter((combo) =>
        combo[dataType].matchesAll(
          searchParams[dataType].includeFilters.map((filter) => filter.value)
        )
      );
    }

    if (searchParams[dataType].excludeFilters.length > 0) {
      combos = combos.filter(
        (combo) =>
          !combo[dataType].matchesAny(
            searchParams[dataType].excludeFilters.map((filter) => filter.value)
          )
      );
    }
  });

  return combos;
}
