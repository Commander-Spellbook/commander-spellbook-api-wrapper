import type { SearchParameters } from "../types";
import normalizeStringInput from "../normalize-string-input";

export default function parseSort(
  params: SearchParameters,
  value: string
): void {
  if (params.sort) {
    params.errors.push({
      key: "sort",
      value,
      message: `Sort option "${params.sort}" already chosen. Sorting by "${value}" will be ignored.`,
    });

    return;
  }

  value = normalizeStringInput(value);

  switch (value) {
    case "results":
    case "numberofresults":
      value = "number-of-results";
      break;
    case "steps":
    case "numberofsteps":
      value = "number-of-steps";
      break;
    case "prerequisites":
    case "numberofprerequisites":
      value = "number-of-prerequisites";
      break;
    case "cards":
    case "numberofcards":
      value = "number-of-cards";
      break;
    // TODO probably drop this
    case "numberofcolors":
      value = "number-of-colors";
      break;
    case "color":
    case "colors":
      // TODO probably add coloridentity
      value = "colors";
      break;
    case "id":
      break;
    default:
      params.errors.push({
        key: "sort",
        value,
        message: `Unknown sort option "${value}".`,
      });
      return;
  }

  params.sort = value;
}
