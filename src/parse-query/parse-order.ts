import type { SearchParameters } from "../types";
import normalizeStringInput from "../normalize-string-input";

export default function parseSort(
  params: SearchParameters,
  value: string
): void {
  if (params.order) {
    params.errors.push({
      key: "order",
      value,
      message: `Order option "${params.order}" already chosen. Ordering by "${value}" will be ignored.`,
    });

    return;
  }

  value = normalizeStringInput(value);

  switch (value) {
    case "asc":
    case "ascending":
      value = "ascending";
      break;
    case "desc":
    case "descending":
      value = "descending";
      break;
  }

  if (value !== "ascending" && value !== "descending") {
    params.errors.push({
      key: "order",
      value,
      message: `Unknown order option "${value}".`,
    });
    return;
  }

  params.order = value;
}
