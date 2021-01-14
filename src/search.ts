import lookupApi from "./spellbook-api";
import parseQuery from "./parse-query";
import filterCards from "./search-filters/cards";
import filterColorIdentity from "./search-filters/color-identity";
import filterComboData from "./search-filters/combo-data";
import filterSize from "./search-filters/size";

import type { SearchResults } from "./types";

export default async function search(query = ""): Promise<SearchResults> {
  const searchParams = parseQuery(query);
  const { errors } = searchParams;

  let combos = await lookupApi();

  if (searchParams.id) {
    const matchingCombo = combos.find(
      (combo) => combo.commanderSpellbookId === searchParams.id
    );
    if (matchingCombo) {
      return {
        errors,
        combos: [matchingCombo],
      };
    }

    return {
      errors,
      combos: [],
    };
  }

  combos = filterCards(combos, searchParams);
  combos = filterColorIdentity(combos, searchParams);
  combos = filterComboData(combos, searchParams);
  combos = filterSize(combos, searchParams);

  return {
    errors,
    combos,
  };
}
