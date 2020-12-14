import type CardGrouping from "./models/card-grouping";
import type SpellbookList from "./models/list";
import type ColorIdentity from "./models/color-identity";

export type CommanderSpellbookCombos = Array<string[]>;

export type CommanderSpellbookAPIResponse = {
  spreadsheetId: string;
  valueRanges: [
    {
      range: string;
      majorDimension: "ROWS";
      values: CommanderSpellbookCombos;
    }
  ];
};

export type FormattedApiResponse = {
  commanderSpellbookId: string;
  permalink: string;
  cards: CardGrouping;
  colorIdentity: ColorIdentity;
  prerequisites: SpellbookList;
  steps: SpellbookList;
  results: SpellbookList;
};

export type ColorIdentityColors = "w" | "u" | "b" | "r" | "g" | "c";

export type SearchError = {
  key: string;
  value: string;
  message: string;
};

export type IncludeExclude = {
  include: string[];
  exclude: string[];
};

export type SearchParameters = {
  cards: IncludeExclude;
  prerequisites: IncludeExclude;
  steps: IncludeExclude;
  results: IncludeExclude;
  id?: string;
  colorIdentity: {
    colorFilter: {
      method: string;
      value: ColorIdentityColors[];
    };
    sizeFilter: {
      method: string;
      value: number;
    };
  };
  errors: SearchError[];
};
