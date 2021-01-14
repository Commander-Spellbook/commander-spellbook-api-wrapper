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

export type SearchResults = {
  combos: FormattedApiResponse[];
  errors: SearchError[];
  message: string;
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

type SizeFilter = {
  method: string;
  value: number;
};

type ValueFilter = {
  method: string;
  value: string;
};

export type Filters = {
  sizeFilters: SizeFilter[];
  includeFilters: ValueFilter[];
  excludeFilters: ValueFilter[];
};

export interface ColorIdentityValueFilter {
  method: string;
  value: ColorIdentityColors[];
}

export type SearchParameters = {
  cards: Filters;
  prerequisites: Filters;
  steps: Filters;
  results: Filters;
  colorIdentity: {
    sizeFilters: SizeFilter[];
    includeFilters: ColorIdentityValueFilter[];
    excludeFilters: ColorIdentityValueFilter[];
  };
  errors: SearchError[];
};
