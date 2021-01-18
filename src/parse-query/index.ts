import parseColorIdentity from "./parse-color-identity";
import parseComboData from "./parse-combo-data";

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
    const key = pair[0]?.toLowerCase().replace(/_/g, "");
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
        params.id.includeFilters.push(value);
        break;
      case "-id":
        params.id.excludeFilters.push(value);
        break;
      case "ci":
      case "-ci":
      case "coloridentity":
      case "-coloridentity":
        parseColorIdentity(params, key, operator, value);
        break;
      case "card":
      case "cards":
      case "-card":
      case "-cards":
      case "pre":
      case "prerequisite":
      case "prerequisites":
      case "-pre":
      case "-prerequisite":
      case "-prerequisites":
      case "step":
      case "steps":
      case "-step":
      case "-steps":
      case "res":
      case "result":
      case "results":
      case "-res":
      case "-result":
      case "-results":
        parseComboData(params, key, operator, value);
        break;
      default:
        params.errors.push({
          key,
          value,
          message: `Could not parse keyword "${key}" with value "${value}".`,
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
    parseComboData(params, "card", ":", value.trim());
  });
}

export default function parseQuery(query: string): SearchParameters {
  const parameters: SearchParameters = {
    id: {
      includeFilters: [],
      excludeFilters: [],
    },
    cards: {
      sizeFilters: [],
      includeFilters: [],
      excludeFilters: [],
    },
    colorIdentity: {
      includeFilters: [],
      excludeFilters: [],
      sizeFilters: [],
    },
    prerequisites: {
      sizeFilters: [],
      includeFilters: [],
      excludeFilters: [],
    },
    steps: {
      sizeFilters: [],
      includeFilters: [],
      excludeFilters: [],
    },
    results: {
      sizeFilters: [],
      includeFilters: [],
      excludeFilters: [],
    },
    errors: [],
  };

  if (!query) {
    return parameters;
  }

  collectPlainNameQueries(parameters, query);
  collectKeywordedQueries(parameters, query);

  return parameters;
}
