import type Card from "./models/card";
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
  commanderSpellbookId: number;
  permalink: string;
  cards: Card[];
  colorIdentity: ColorIdentity;
  prerequisites: SpellbookList;
  steps: SpellbookList;
  result: SpellbookList;
};

export type ColorIdentityColors = "w" | "u" | "b" | "r" | "g" | "c";
