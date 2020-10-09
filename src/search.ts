import lookupApi from "./spellbook-api";
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
    combos = combos.filter((combo) => combo.cards.matches(cards));
  }

  if (colorIdentity.length > 0) {
    combos = combos.filter((combo) =>
      combo.colorIdentity.hasColors(colorIdentity)
    );
  }

  return combos;
}
