import normalizeStringInput from "./normalize-string-input";
import type { FormattedApiResponse } from "./types";

export default function filterByCards(
  cards: string[],
  combos: FormattedApiResponse[]
): FormattedApiResponse[] {
  return cards
    .map((card) => normalizeStringInput(card))
    .reduce((total, cardInput) => {
      return total.filter((combo) => {
        return combo.cards.find(
          (cardInCombo) =>
            normalizeStringInput(cardInCombo.name).indexOf(cardInput) > -1
        );
      });
    }, combos);
}
