import type { SearchParameters, FormattedApiResponse } from "../types";

export const SIZE_RESTRICTED_FILTERS: ["colorIdentity", "cards"] = [
  "colorIdentity",
  "cards",
];

export default function filterSize(
  combos: FormattedApiResponse[],
  params: SearchParameters
): FormattedApiResponse[] {
  SIZE_RESTRICTED_FILTERS.forEach((dataType) => {
    if (params[dataType].sizeFilters.length > 0) {
      combos = combos.filter((combo) => {
        const numberOfValues = combo[dataType].size();

        return params[dataType].sizeFilters.every((filter) => {
          switch (filter.method) {
            case ":":
            case "=":
              return numberOfValues === filter.value;
            case ">":
              return numberOfValues > filter.value;
            case ">=":
              return numberOfValues >= filter.value;
            case "<":
              return numberOfValues < filter.value;
            case "<=":
              return numberOfValues <= filter.value;
            default:
              return true;
          }
        });
      });
    }
  });

  return combos;
}
