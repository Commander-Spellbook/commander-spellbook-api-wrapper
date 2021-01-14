import type { FormattedApiResponse, SearchParameters } from "../types";

export const DATA_TYPES: ["cards", "prerequisites", "steps", "results"] = [
  "cards",
  "prerequisites",
  "steps",
  "results",
];

function numberOperatorAsWord(operator: string): string {
  switch (operator) {
    case "=":
      return "equals";
    case ">":
      return "is greater than";
    case "<":
      return "is less than";
    case ">=":
      return "is greater than or equal to";
    case "<=":
      return "is less than or equal to";
    default:
      return operator;
  }
}

function colorOperatorAsWord(operator: string): string {
  switch (operator) {
    case "=":
      return "exactly";
    case ">":
      return "greater than";
    case "<":
      return "less than";
    case ">=":
      return "greater than or equal to";
    case ":":
    case "<=":
      return "within";
    default:
      return operator;
  }
}

function nameOperatorAsWord(operator: string): string {
  switch (operator) {
    case "=":
      return "of exactly";
    case ":":
      return "containing";
    default:
      return operator;
  }
}

export default function creaetMessage(
  combos: FormattedApiResponse[],
  params: SearchParameters
): string {
  let message = "";

  DATA_TYPES.forEach((dataType) => {
    params[dataType].sizeFilters.forEach((filter) => {
      if (message) {
        message += " and ";
      }

      message += `the number of ${dataType} ${numberOperatorAsWord(
        filter.method
      )} ${filter.value}`;
    });

    params[dataType].includeFilters.forEach((filter) => {
      if (message) {
        message += " and ";
      }

      message += `${dataType} have a value ${nameOperatorAsWord(
        filter.method
      )} "${filter.value.replace(/"/g, '\\"')}"`;
    });

    params[dataType].excludeFilters.forEach((filter) => {
      if (message) {
        message += " and ";
      }

      message += `${dataType} do not have a value ${nameOperatorAsWord(
        filter.method
      )} "${filter.value.replace(/"/g, '\\"')}"`;
    });
  });

  params.colorIdentity.sizeFilters.forEach((filter) => {
    if (message) {
      message += " and ";
    }

    message += `the number of colors ${numberOperatorAsWord(filter.method)} ${
      filter.value
    }`;
  });

  params.colorIdentity.includeFilters.forEach((filter) => {
    if (message) {
      message += " and ";
    }

    message += `colors that are ${colorOperatorAsWord(
      filter.method
    )} "${filter.value.join("")}"`;
  });

  params.colorIdentity.excludeFilters.forEach((filter) => {
    if (message) {
      message += " and ";
    }

    message += `colors that are not ${colorOperatorAsWord(
      filter.method
    )} "${filter.value.join("")}"`;
  });

  let prefix = `${combos.length} combo`;

  if (combos.length !== 1) {
    prefix += "s";
  }

  prefix += " where ";

  return prefix + message + ".";
}
