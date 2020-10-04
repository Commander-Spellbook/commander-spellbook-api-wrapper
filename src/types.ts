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
  prerequisites: string[];
  steps: string[];
  result: string[];
};

export type ColorIdentity = "w" | "u" | "b" | "r" | "g" | "c";
