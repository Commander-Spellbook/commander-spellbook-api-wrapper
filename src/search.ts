import lookupApi from "./spellbook-api";
import parseQuery from "./parse-query";
import filterColorIdentity from "./search-filters/color-identity";
import filterComboData from "./search-filters/combo-data";
import filterSize from "./search-filters/size";
import createMessage from "./parse-query/create-message";

import type { SearchResults } from "./types";

export default async function search(query = ""): Promise<SearchResults> {
  const searchParams = parseQuery(query);
  const { errors } = searchParams;

  let combos = await lookupApi();

  combos = filterColorIdentity(combos, searchParams);
  combos = filterComboData(combos, searchParams);
  combos = filterSize(combos, searchParams);

  return {
    errors,
    combos,
    message: createMessage(combos, searchParams),
  };
}
