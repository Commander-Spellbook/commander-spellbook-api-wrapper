import COLOR_ORDER from "./color-combo-order";

import type { FormattedApiResponse } from "./types";

type SortingMeta = {
  isEqual: boolean;
  firstRemainsFirst: boolean;
};

function handleSortingForNumberOfElements(
  firstCombo: FormattedApiResponse,
  secondCombo: FormattedApiResponse,
  by: string
): SortingMeta {
  const prop = by.split("number-of-")[1] as
    | "cards"
    | "prerequisites"
    | "steps"
    | "results";
  const isEqual = firstCombo[prop].length === secondCombo[prop].length;
  const firstRemainsFirst = firstCombo[prop].length > secondCombo[prop].length;

  return {
    isEqual,
    firstRemainsFirst,
  };
}

function handleSortingByColorIdentity(
  firstCombo: FormattedApiResponse,
  secondCombo: FormattedApiResponse
): SortingMeta {
  const firstIndexInColorOrder = COLOR_ORDER.findIndex((colorCombo) => {
    return firstCombo.colorIdentity.is(colorCombo);
  });
  const secondIndexInColorOrder = COLOR_ORDER.findIndex((colorCombo) => {
    return secondCombo.colorIdentity.is(colorCombo);
  });
  const isEqual = firstIndexInColorOrder === secondIndexInColorOrder;
  const firstRemainsFirst = firstIndexInColorOrder > secondIndexInColorOrder;

  if (isEqual) {
    return handleSortingForNumberOfElements(
      firstCombo,
      secondCombo,
      "number-of-cards"
    );
  }

  return {
    isEqual,
    firstRemainsFirst,
  };
}

export default function sortCombos(
  combos: FormattedApiResponse[],
  by: string,
  order: "ascending" | "descending"
): FormattedApiResponse[] {
  combos = combos.sort((firstCombo, secondCombo) => {
    let meta = {
      isEqual: false,
      firstRemainsFirst: true,
    };

    switch (by) {
      case "id":
        meta.isEqual =
          firstCombo.commanderSpellbookId === secondCombo.commanderSpellbookId;
        meta.firstRemainsFirst =
          firstCombo.commanderSpellbookId > secondCombo.commanderSpellbookId;
        break;
      case "number-of-cards":
      case "number-of-prerequisites":
      case "number-of-steps":
      case "number-of-results":
        meta = handleSortingForNumberOfElements(firstCombo, secondCombo, by);
        break;
      case "colors":
        meta = handleSortingByColorIdentity(firstCombo, secondCombo);
        break;
    }

    if (meta.isEqual) {
      return 0;
    }

    return meta.firstRemainsFirst ? 1 : -1;
  });

  if (order === "descending") {
    combos.reverse();
  }

  return combos;
}
