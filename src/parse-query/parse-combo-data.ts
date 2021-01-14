import type { SearchParameters } from "../types";

const COMBO_DATA_TYPES: ["prerequisites", "steps", "results"] = [
  "prerequisites",
  "steps",
  "results",
];

export default function parseComboData(
  params: SearchParameters,
  key: string,
  operator: string,
  value: string
): void {
  const isNegativeKey = key.charAt(0) === "-";
  const normalizedKey = isNegativeKey ? key.substring(1) : key;

  COMBO_DATA_TYPES.forEach((dataType) => {
    if (dataType.indexOf(normalizedKey) === -1) {
      return;
    }

    if (isNegativeKey) {
      params[dataType].exclude.push(value);

      return;
    }

    params[dataType].include.push(value);
  });
}
