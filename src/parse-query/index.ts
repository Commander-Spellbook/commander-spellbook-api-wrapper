import parseColorIdentity from "./parse-color-identity";
import parseCardQuery from "./parse-card-query";

import type { SearchParameters } from "../types";

const OPERATORS = [":", "=", ">=", "<=", "<", ">"];
const OPERATOR_REGEX = new RegExp(`(${OPERATORS.join("|")})`);

function collectKeywordedQueries(
  params: SearchParameters,
  query: string
): void {
  // this is pretty complex, thanks to @lejeunerenard for help with it
  // (-)? optional negative sign
  // \b(\w+) a word boundary and any number of word characters
  // (:|=|>=|<=|>|<) the operators we look for
  // (['"]?) an optional capture for either a single or double quote
  // ( an open capture group
  //   (?:.(?!\4))+. any number of characters that do not match \4, the captured quote
  //   | or
  //   [^\s]+ any number of characters that are not spaces
  // ) the closing of the capture group
  // \4 the closing single or double quote
  const queries =
    query.match(
      /(-)?\b(\w+)(:|=|>=|<=|>|<)(['"]?)((?:.(?!\4))+.|[^\s]+)\4/gi
    ) || [];

  queries.forEach((group) => {
    const operator = (group.match(OPERATOR_REGEX) || [":"])[0];
    const pair = group.split(operator);
    const key = pair[0]?.toLowerCase();
    let value = pair[1];

    if (value.length > 2) {
      const firstChar = value.charAt(0);
      const lastChar = value.charAt(value.length - 1);
      if (
        (firstChar === "'" && lastChar === "'") ||
        (firstChar === '"' && lastChar === '"')
      ) {
        value = value.substring(1, value.length - 1);
      }
    }

    switch (key) {
      case "id":
        params.id = value;
        break;
      case "ci":
      case "color_identity":
      case "coloridentity":
        if (Number(value) >= 0 && Number(value) < 6) {
          params.colorIdentity.sizeFilter.method = operator;
          params.colorIdentity.sizeFilter.value = Number(value);
        } else {
          params.colorIdentity.valueFilter.method = operator;
          params.colorIdentity.valueFilter.value = parseColorIdentity(value);
        }
        break;
      case "card":
      case "-card":
        parseCardQuery(params, key, operator, value);
        break;
      case "pre":
      case "prerequisite":
      case "prerequisites":
        params.prerequisites.include.push(value);
        break;
      case "-pre":
      case "-prerequisite":
      case "-prerequisites":
        params.prerequisites.exclude.push(value);
        break;
      case "step":
      case "steps":
        params.steps.include.push(value);
        break;
      case "-step":
      case "-steps":
        params.steps.exclude.push(value);
        break;
      case "result":
      case "results":
        params.results.include.push(value);
        break;
      case "-result":
      case "-results":
        params.results.exclude.push(value);
        break;
      default:
        params.errors.push({
          key,
          value,
          message: `Could not parse keyword "${key}" with value "${value}"`,
        });
    }
  });
}

function collectPlainNameQueries(
  params: SearchParameters,
  query: string
): void {
  const simpleQueryGroups =
    query.match(
      // this is pretty complex, thanks to @NilsEnevoldsen for help with it
      // (?<=^|\s) - either starts at the beginning of the line or begins with a space
      // (?!:) - does not have a colon
      // (\w+) - any number of word characters
      // (?=$|\s) - ends the line or ends with a space
      // (?=([^"']*["'][^"']*["'])*[^"']*$) - does some lookaheads to avoid quotes
      /(^|\s)(?!:)(\w+)(?=$|\s)(?=([^"']*["'][^"']*["'])*[^"']*$)/gi
    ) || [];
  const queries = simpleQueryGroups;

  queries.forEach((value) => {
    parseCardQuery(params, "card", ":", value.trim());
  });
}

export default function parseQuery(query: string): SearchParameters {
  const parameters = {
    cards: {
      sizeFilters: [],
      includeFilters: [],
      excludeFilters: [],
    },
    colorIdentity: {
      valueFilter: {
        method: "none",
        value: [],
      },
      sizeFilter: {
        method: "none",
        value: 5,
      },
    },
    prerequisites: {
      include: [],
      exclude: [],
    },
    steps: {
      include: [],
      exclude: [],
    },
    results: {
      include: [],
      exclude: [],
    },
    errors: [],
  } as SearchParameters;

  if (!query) {
    return parameters;
  }

  collectPlainNameQueries(parameters, query);
  collectKeywordedQueries(parameters, query);

  return parameters;
}
