import type { SearchParameters, FormattedApiResponse } from "../types";

export default function filterCards(
  combos: FormattedApiResponse[],
  params: SearchParameters
): FormattedApiResponse[] {
  if (params.cards.includeFilters.length > 0) {
    combos = combos.filter((combo) => {
      return params.cards.includeFilters.every((filter) => {
        return combo.cards.includesValue(filter.value);
      });
    });
  }

  if (params.cards.excludeFilters.length > 0) {
    combos = combos.filter((combo) => {
      return !params.cards.excludeFilters.find((filter) => {
        return combo.cards.includesValue(filter.value);
      });
    });
  }

  return combos;
}
