import type { IsNotIncludeExcludeValues, SearchParameters } from "../types";
type SupportedKeys = "is" | "-is" | "not" | "-not";
type SupportedValues = "banned" | "spoiled" | "previewed";

type IsNot = "is" | "not";

const SUPPORTED_OPERATORS = [":"];

export default function parseIsNot(
  params: SearchParameters,
  key: SupportedKeys,
  operator: string,
  value: SupportedValues
): void {
  let normalizedKey: IsNot;
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
    case "not":
    case "-is":
      normalizedKey = "not";
      break;
    case "is":
    case "-not":
      normalizedKey = "is";
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
