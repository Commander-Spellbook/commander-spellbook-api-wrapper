import lookup, { resetCache } from "../../src/spellbook-api";
import {
  CommanderSpellbookCombos,
  CommanderSpellbookAPIResponse,
} from "../../src/types";
import superagent = require("superagent");

import { mocked } from "ts-jest/utils";

describe("api", () => {
  let values: CommanderSpellbookCombos;
  let response: {
    body: CommanderSpellbookAPIResponse;
  };

  beforeEach(() => {
    values = [
      [
        "1",
        "Guilded Lotus",
        "Voltaic Servant",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "c",
        "prereq 1. prereq 2. prereq 3",
        "step 1. step 2. step 3",
        "result 1. result 2. result 3",
      ],
      [
        "2",
        "Mindmoil",
        "Psychosis Crawler",
        "Teferi's Ageless Insight",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "r,u",
        "prereq",
        "step",
        "result",
      ],
      [
        "3",
        "Sidar Kondo of Jamurra",
        "Tana the Bloodsower",
        "Breath of Furt",
        "Fervor",
        "",
        "",
        "",
        "",
        "",
        "",
        "r,g,w",
        "prereq",
        "step",
        "result",
      ],
    ];
    const body = {
      spreadsheetId: "foo-1",
      valueRanges: [
        {
          range: "foo",
          majorDimension: "ROWS",
          values,
        },
      ],
    } as CommanderSpellbookAPIResponse;
    response = { body };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(superagent, "get").mockResolvedValue(response);
  });

  afterEach(() => {
    resetCache();
  });

  it("looks up google sheets api", async () => {
    await lookup();

    expect(superagent.get).toBeCalledWith(
      expect.stringContaining("sheets.googleapis.com")
    );
  });

  it("caches result after first lookup", async () => {
    const firstResult = await lookup();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mocked(superagent.get).mockResolvedValue({
      body: {
        spreadsheetId: "foo-2",
        valueRanges: [
          {
            range: "bar",
            majorDimension: "ROWS",
            values: [],
          },
        ],
      },
    });

    const secondResult = await lookup();

    expect(firstResult).toBe(secondResult);

    expect(superagent.get).toBeCalledTimes(1);
  });

  it("caches for 6 hours", async () => {
    jest.useFakeTimers();

    const firstResult = await lookup();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mocked(superagent.get).mockResolvedValue({
      body: {
        spreadsheetId: "foo-2",
        valueRanges: [
          {
            range: "bar",
            majorDimension: "ROWS",
            values: [],
          },
        ],
      },
    });

    jest.advanceTimersByTime(2159999);

    const secondResult = await lookup();
    expect(firstResult).toBe(secondResult);

    jest.advanceTimersByTime(2);

    const thirdResult = await lookup();
    expect(firstResult).not.toBe(thirdResult);

    expect(superagent.get).toBeCalledTimes(2);
  });

  it("formats spreadsheet into usable object", async () => {
    const combos = await lookup();

    expect(combos[0]).toEqual({
      commanderSpellbookId: 1,
      permalink: "https://commanderspellbook.com/?id=1",
      cards: ["Guilded Lotus", "Voltaic Servant"],
      colorIdentity: ["c"],
      prerequisites: ["prereq 1", "prereq 2", "prereq 3"],
      steps: ["step 1", "step 2", "step 3"],
      result: ["result 1", "result 2", "result 3"],
    });

    expect(combos[1]).toEqual({
      commanderSpellbookId: 2,
      permalink: "https://commanderspellbook.com/?id=2",
      cards: ["Mindmoil", "Psychosis Crawler", "Teferi's Ageless Insight"],
      colorIdentity: ["r", "u"],
      prerequisites: ["prereq"],
      steps: ["step"],
      result: ["result"],
    });

    expect(combos[2]).toEqual({
      commanderSpellbookId: 3,
      permalink: "https://commanderspellbook.com/?id=3",
      cards: [
        "Sidar Kondo of Jamurra",
        "Tana the Bloodsower",
        "Breath of Furt",
        "Fervor",
      ],
      colorIdentity: ["g", "r", "w"],
      prerequisites: ["prereq"],
      steps: ["step"],
      result: ["result"],
    });
  });

  it("handles malformed color idenitity strings", async () => {
    values[0][11] = "w,u,";

    const combos = await lookup();

    expect(combos[0].colorIdentity).toEqual(["u", "w"]);
  });

  it("ignores combo results with fewer than the correct number of columns in the spreadsheet", async () => {
    values[1] = ["foo"];

    const combos = await lookup();

    expect(combos.length).toBe(2);
    expect(combos[0]).toEqual({
      commanderSpellbookId: 1,
      permalink: "https://commanderspellbook.com/?id=1",
      cards: ["Guilded Lotus", "Voltaic Servant"],
      colorIdentity: ["c"],
      prerequisites: ["prereq 1", "prereq 2", "prereq 3"],
      steps: ["step 1", "step 2", "step 3"],
      result: ["result 1", "result 2", "result 3"],
    });

    expect(combos[1]).toEqual({
      commanderSpellbookId: 3,
      permalink: "https://commanderspellbook.com/?id=3",
      cards: [
        "Sidar Kondo of Jamurra",
        "Tana the Bloodsower",
        "Breath of Furt",
        "Fervor",
      ],
      colorIdentity: ["g", "r", "w"],
      prerequisites: ["prereq"],
      steps: ["step"],
      result: ["result"],
    });
  });

  it("ignores combo results without a card 1 value", async () => {
    values[1][1] = "";

    const combos = await lookup();

    expect(combos.length).toBe(2);
    expect(combos[0]).toEqual({
      commanderSpellbookId: 1,
      permalink: "https://commanderspellbook.com/?id=1",
      cards: ["Guilded Lotus", "Voltaic Servant"],
      colorIdentity: ["c"],
      prerequisites: ["prereq 1", "prereq 2", "prereq 3"],
      steps: ["step 1", "step 2", "step 3"],
      result: ["result 1", "result 2", "result 3"],
    });

    expect(combos[1]).toEqual({
      commanderSpellbookId: 3,
      permalink: "https://commanderspellbook.com/?id=3",
      cards: [
        "Sidar Kondo of Jamurra",
        "Tana the Bloodsower",
        "Breath of Furt",
        "Fervor",
      ],
      colorIdentity: ["g", "r", "w"],
      prerequisites: ["prereq"],
      steps: ["step"],
      result: ["result"],
    });
  });

  it("ignores combo results without a color identity value", async () => {
    values[1][11] = "";

    const combos = await lookup();

    expect(combos.length).toBe(2);
    expect(combos[0]).toEqual({
      commanderSpellbookId: 1,
      permalink: "https://commanderspellbook.com/?id=1",
      cards: ["Guilded Lotus", "Voltaic Servant"],
      colorIdentity: ["c"],
      prerequisites: ["prereq 1", "prereq 2", "prereq 3"],
      steps: ["step 1", "step 2", "step 3"],
      result: ["result 1", "result 2", "result 3"],
    });

    expect(combos[1]).toEqual({
      commanderSpellbookId: 3,
      permalink: "https://commanderspellbook.com/?id=3",
      cards: [
        "Sidar Kondo of Jamurra",
        "Tana the Bloodsower",
        "Breath of Furt",
        "Fervor",
      ],
      colorIdentity: ["g", "r", "w"],
      prerequisites: ["prereq"],
      steps: ["step"],
      result: ["result"],
    });
  });
});
