import type SpellbookList from "./models/list";

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
  cards: string[];
  colorIdentity: string[];
  prerequisites: SpellbookList;
  steps: SpellbookList;
  result: SpellbookList;
};

export type ColorIdentity = "w" | "u" | "b" | "r" | "g" | "c";
