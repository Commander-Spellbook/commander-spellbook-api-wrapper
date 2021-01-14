import lookupApi from "./spellbook-api";
import parseQuery from "./parse-query";

import type { SearchResults } from "./types";

export default async function search(query = ""): Promise<SearchResults> {
  const searchParams = parseQuery(query);
  const { errors } = searchParams;
  const cards = searchParams.cards;

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

  if (cards.includeFilters.length > 0) {
    combos = combos.filter((combo) => {
      return cards.includeFilters.every((filter) => {
        return combo.cards.includesCard(filter.value);
      });
    });
  }

  if (cards.excludeFilters.length > 0) {
    combos = combos.filter((combo) => {
      return !cards.excludeFilters.find((filter) => {
        return combo.cards.includesCard(filter.value);
      });
    });
  }

  if (searchParams.colorIdentity.includeFilters.length > 0) {
    combos = combos.filter((combo) => {
      return searchParams.colorIdentity.includeFilters.every((filter) => {
        switch (filter.method) {
          case "=":
            return combo.colorIdentity.is(filter.value);
          case ">":
            return (
              combo.colorIdentity.includes(filter.value) &&
              !combo.colorIdentity.is(filter.value)
            );
          case ">=":
            return combo.colorIdentity.includes(filter.value);
          case "<":
            return (
              combo.colorIdentity.isWithin(filter.value) &&
              !combo.colorIdentity.is(filter.value)
            );
          case "<=":
          case ":":
            return combo.colorIdentity.isWithin(filter.value);
          default:
            return true;
        }
      });
    });
  }

  if (searchParams.colorIdentity.sizeFilters.length > 0) {
    combos = combos.filter((combo) => {
      const numberOfColors = combo.colorIdentity.numberOfColors();

      return searchParams.colorIdentity.sizeFilters.every((filter) => {
        switch (filter.method) {
          case ":":
          case "=":
            return numberOfColors === filter.value;
          case ">":
            return numberOfColors > filter.value;
          case ">=":
            return numberOfColors >= filter.value;
          case "<":
            return numberOfColors < filter.value;
          case "<=":
            return numberOfColors <= filter.value;
          default:
            return true;
        }
      });
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
