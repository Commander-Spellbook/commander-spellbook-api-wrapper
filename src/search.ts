import lookupApi from "./spellbook-api";
import parseQuery from "./parse-query";

import type {
  SearchParameters,
  SearchResults,
  FormattedApiResponse,
  ColorIdentityValueFilter,
} from "./types";

function filterCards(
  combos: FormattedApiResponse[],
  params: SearchParameters
): FormattedApiResponse[] {
  if (params.cards.includeFilters.length > 0) {
    combos = combos.filter((combo) => {
      return params.cards.includeFilters.every((filter) => {
        return combo.cards.includesCard(filter.value);
      });
    });
  }

  if (params.cards.excludeFilters.length > 0) {
    combos = combos.filter((combo) => {
      return !params.cards.excludeFilters.find((filter) => {
        return combo.cards.includesCard(filter.value);
      });
    });
  }

  return combos;
}

function getColorIdentityMethodFilter(
  combo: FormattedApiResponse
): Parameters<typeof Array.prototype.find>[0] {
  return function filterColorIdentityByMethod(
    filter: ColorIdentityValueFilter
  ) {
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
  };
}

function filterColorIdentity(
  combos: FormattedApiResponse[],
  params: SearchParameters
): FormattedApiResponse[] {
  if (params.colorIdentity.includeFilters.length > 0) {
    combos = combos.filter((combo) => {
      return params.colorIdentity.includeFilters.every(
        getColorIdentityMethodFilter(combo)
      );
    });
  }

  if (params.colorIdentity.excludeFilters.length > 0) {
    combos = combos.filter((combo) => {
      return !params.colorIdentity.excludeFilters.find(
        getColorIdentityMethodFilter(combo)
      );
    });
  }

  if (params.colorIdentity.sizeFilters.length > 0) {
    combos = combos.filter((combo) => {
      const numberOfColors = combo.colorIdentity.numberOfColors();

      return params.colorIdentity.sizeFilters.every((filter) => {
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

  return combos;
}

function filterPrerequisites(
  combos: FormattedApiResponse[],
  searchParams: SearchParameters
): FormattedApiResponse[] {
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

  return combos;
}

function filterSteps(
  combos: FormattedApiResponse[],
  searchParams: SearchParameters
): FormattedApiResponse[] {
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

  return combos;
}

function filterResults(
  combos: FormattedApiResponse[],
  searchParams: SearchParameters
): FormattedApiResponse[] {
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

  return combos;
}

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
  combos = filterPrerequisites(combos, searchParams);
  combos = filterSteps(combos, searchParams);
  combos = filterResults(combos, searchParams);

  return {
    errors,
    combos,
  };
}
