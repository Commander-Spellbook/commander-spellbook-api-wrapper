import type { SearchParameters } from "../types";

const SUPPORTED_OPERATORS_FOR_CARD_NAMES = [":", "="];

export default function parseCardQuery(
  params: SearchParameters,
  key: string,
  operator: string,
  value: string
): void {
  const isNegativeKey = key.charAt(0) === "-";

  if (operator !== ":" && Number(value) >= 0 && Number(value) < 11) {
    if (isNegativeKey) {
      params.errors.push({
        key,
        value,
        message: `The key "${key}" does not support operator "${operator}"`,
      });

      return;
    }

    params.cards.sizeFilters.push({
      method: operator,
      value: Number(value),
    });

    return;
  }

  if (!SUPPORTED_OPERATORS_FOR_CARD_NAMES.includes(operator)) {
    params.errors.push({
      key,
      value,
      message: `Operator ${operator} is not compatible with key "${key}" and value "${value}"`,
    });

    return;
  }

  if (isNegativeKey) {
    params.cards.excludeFilters.push({
      method: operator,
      value,
    });

    return;
  }

  params.cards.includeFilters.push({
    method: operator,
    value,
  });
}
