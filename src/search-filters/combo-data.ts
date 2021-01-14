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
    if (searchParams[dataType].include.length > 0) {
      combos = combos.filter((combo) =>
        combo[dataType].matchesAll(searchParams[dataType].include)
      );
    }

    if (searchParams[dataType].exclude.length > 0) {
      combos = combos.filter(
        (combo) => !combo[dataType].matchesAny(searchParams[dataType].exclude)
      );
    }
  });

  return combos;
}
