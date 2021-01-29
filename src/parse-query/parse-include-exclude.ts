import type { IsNotIncludeExcludeValues, SearchParameters } from "../types";
type SupportedKeys = "include" | "-include" | "exclude" | "-exclude";
type SupportedValues = "banned" | "spoiled" | "previewed";

type IncludeExclude = "include" | "exclude";

const SUPPORTED_OPERATORS = [":"];

export default function parseIsNot(
  params: SearchParameters,
  key: SupportedKeys,
  operator: string,
  value: SupportedValues
): void {
  let normalizedKey: IncludeExclude;
  let normalizedValue: IsNotIncludeExcludeValues;

  if (!SUPPORTED_OPERATORS.includes(operator)) {
    params.errors.push({
      key,
      value,
      message: `The key "${key}" does not support operator "${operator}".`,
    });
    return;
  }

  switch (key) {
    case "exclude":
    case "-include":
      normalizedKey = "exclude";
      break;
    case "include":
    case "-exclude":
      normalizedKey = "include";
  }

  switch (value) {
    case "banned":
      normalizedValue = "banned";
      break;
    case "spoiled":
    case "previewed":
      normalizedValue = "spoiled";
  }

  params[normalizedKey][normalizedValue] = true;
}
