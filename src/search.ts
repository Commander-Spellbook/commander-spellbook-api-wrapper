import lookupApi from "./spellbook-api";
import parseQuery from "./parse-query";
import normalizeStringInput from "./normalize-string-input";

import type { ColorIdentityColors, FormattedApiResponse } from "./types";

export default async function search(
  query = ""
): Promise<FormattedApiResponse[]> {
  const searchParams = parseQuery(query);
  const cards = searchParams.cards;
  let colorIdentityFilter = searchParams.colorIdentity.colorFilter.value;

  if (colorIdentityFilter) {
    colorIdentityFilter = colorIdentityFilter.map((color) =>
      normalizeStringInput(color)
    ) as ColorIdentityColors[];
  }

  let combos = await lookupApi();

  if (searchParams.id) {
    const matchingCombo = combos.find(
      (combo) => combo.commanderSpellbookId === searchParams.id
    );
    if (matchingCombo) {
      return [matchingCombo];
    }

    return [];
  }

  if (cards.include.length > 0) {
    combos = combos.filter((combo) => combo.cards.matches(cards.include));
  }

  if (cards.exclude.length > 0) {
    combos = combos.filter((combo) => !combo.cards.matches(cards.exclude));
  }

  if (colorIdentityFilter.length > 0) {
    combos = combos.filter((combo) => {
      switch (searchParams.colorIdentity.colorFilter.method) {
        case "=":
          return combo.colorIdentity.is(colorIdentityFilter);
        case ">":
          return (
            combo.colorIdentity.includes(colorIdentityFilter) &&
            !combo.colorIdentity.is(colorIdentityFilter)
          );
        case ">=":
          return combo.colorIdentity.includes(colorIdentityFilter);
        case "<":
          return (
            combo.colorIdentity.isWithin(colorIdentityFilter) &&
            !combo.colorIdentity.is(colorIdentityFilter)
          );
        case "<=":
        case ":":
          return combo.colorIdentity.isWithin(colorIdentityFilter);
        default:
          return true;
      }
    });
  }

  if (searchParams.colorIdentity.sizeFilter.method !== "none") {
    const sizeValue = searchParams.colorIdentity.sizeFilter.value;

    combos = combos.filter((combo) => {
      const numberOfColors = combo.colorIdentity.numberOfColors();

      switch (searchParams.colorIdentity.sizeFilter.method) {
        case ":":
        case "=":
          return numberOfColors === sizeValue;
        case ">":
          return numberOfColors > sizeValue;
        case ">=":
          return numberOfColors >= sizeValue;
        case "<":
          return numberOfColors < sizeValue;
        case "<=":
          return numberOfColors <= sizeValue;
        default:
          return true;
      }
    });
  }

  if (searchParams.prerequisites.include.length > 0) {
    combos = combos.filter((combo) =>
      combo.prerequisites.matches(searchParams.prerequisites.include)
    );
  }
  if (searchParams.prerequisites.exclude.length > 0) {
    combos = combos.filter(
      (combo) =>
        !combo.prerequisites.matches(searchParams.prerequisites.exclude)
    );
  }

  if (searchParams.steps.include.length > 0) {
    combos = combos.filter((combo) =>
      combo.steps.matches(searchParams.steps.include)
    );
  }
  if (searchParams.steps.exclude.length > 0) {
    combos = combos.filter(
      (combo) => !combo.steps.matches(searchParams.steps.exclude)
    );
  }

  if (searchParams.results.include.length > 0) {
    combos = combos.filter((combo) =>
      combo.results.matches(searchParams.results.include)
    );
  }
  if (searchParams.results.exclude.length > 0) {
    combos = combos.filter(
      (combo) => !combo.results.matches(searchParams.results.exclude)
    );
  }

  return combos;
}
