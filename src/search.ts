import lookupApi from "./spellbook-api";
import parseQuery from "./parse-query";
import filterIds from "./search-filters/ids";
import filterColorIdentity from "./search-filters/color-identity";
import filterComboData from "./search-filters/combo-data";
import filterSize from "./search-filters/size";
import filterTags from "./search-filters/tags";
import createMessage from "./parse-query/create-message";

import type { SearchResults } from "./types";

export default async function search(query = ""): Promise<SearchResults> {
  const searchParams = parseQuery(query);
  const { errors } = searchParams;

  let combos = await lookupApi();

  combos = filterIds(combos, searchParams);
  combos = filterColorIdentity(combos, searchParams);
  combos = filterComboData(combos, searchParams);
  combos = filterSize(combos, searchParams);
  combos = filterTags(combos, searchParams);

  return {
    errors,
    combos,
    message: createMessage(combos, searchParams),
  };
}
