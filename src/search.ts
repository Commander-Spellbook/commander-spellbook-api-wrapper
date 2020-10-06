import lookupApi from "./spellbook-api";
import filterByCards from "./filter-by-cards";
import filterByColorIdentity from "./filter-by-color-identity";
import normalizeStringInput from "./normalize-string-input";

import type { ColorIdentityColors, FormattedApiResponse } from "./types";
type SearchOptions = {
  cards?: string[];
  colorIdentity?: string | ColorIdentityColors[];
};

export default async function search(
  options: SearchOptions = {}
): Promise<FormattedApiResponse[]> {
  let colorIdentity: ColorIdentityColors[] = [];
  const cards = options.cards || [];

  if (options.colorIdentity) {
    if (typeof options.colorIdentity === "string") {
      colorIdentity = options.colorIdentity
        .split("")
        .filter((color) => /\w/.test(color)) as ColorIdentityColors[];
    } else {
      colorIdentity = options.colorIdentity;
    }
    colorIdentity = colorIdentity.map((color) =>
      normalizeStringInput(color)
    ) as ColorIdentityColors[];
  }

  let combos = await lookupApi();

  if (cards.length > 0) {
    combos = filterByCards(cards, combos);
  }

  if (colorIdentity.length > 0) {
    combos = filterByColorIdentity(colorIdentity, combos);
  }

  return combos;
}
