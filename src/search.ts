import lookupApi from "./spellbook-api";

import type { FormattedApiResponse } from "./types";
type SearchOptions = {
  cards?: string[];
};

function normalizeCardName(cardName: string): string {
  return cardName.toLowerCase().replace(/[^a-zA-Z 0-9]+/g, "");
}

export default async function search(
  options: SearchOptions
): Promise<FormattedApiResponse[]> {
  const cards = options.cards || [];

  const spellbook = await lookupApi();

  const combos = cards
    .map((card) => normalizeCardName(card))
    .reduce((total, cardInput) => {
      return total.filter((combo) => {
        return combo.cards.find(
          (cardInCombo) =>
            normalizeCardName(cardInCombo).indexOf(cardInput) > -1
        );
      });
    }, spellbook);

  return combos;
}
