import lookupApi from "./spellbook-api";
import parseQuery from "./parse-query";
import normalizeStringInput from "./normalize-string-input";

import type { ColorIdentityColors, SearchResults } from "./types";

export default async function search(query = ""): Promise<SearchResults> {
  const searchParams = parseQuery(query);
  const { errors } = searchParams;
  const cards = searchParams.cards;
  let colorIdentityFilter = searchParams.colorIdentity.valueFilter.value;

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

  if (cards.include.length > 0) {
    combos = combos.filter((combo) => combo.cards.matchesAll(cards.include));
  }

  if (cards.exclude.length > 0) {
    combos = combos.filter((combo) => !combo.cards.matchesAny(cards.exclude));
  }

  if (colorIdentityFilter.length > 0) {
    combos = combos.filter((combo) => {
      switch (searchParams.colorIdentity.valueFilter.method) {
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
      combo.prerequisites.matchesAll(searchParams.prerequisites.include)
    );
  }
  if (searchParams.prerequisites.exclude.length > 0) {
    combos = combos.filter(
      (combo) =>
        !combo.prerequisites.matchesAny(searchParams.prerequisites.exclude)
    );
  }

  if (searchParams.steps.include.length > 0) {
    combos = combos.filter((combo) =>
      combo.steps.matchesAll(searchParams.steps.include)
    );
  }
  if (searchParams.steps.exclude.length > 0) {
    combos = combos.filter(
      (combo) => !combo.steps.matchesAny(searchParams.steps.exclude)
    );
  }

  if (searchParams.results.include.length > 0) {
    combos = combos.filter((combo) =>
      combo.results.matchesAll(searchParams.results.include)
    );
  }
  if (searchParams.results.exclude.length > 0) {
    combos = combos.filter((combo) => {
      return !combo.results.matchesAny(searchParams.results.exclude);
    });
  }

  return {
    errors,
    combos,
  };
}
