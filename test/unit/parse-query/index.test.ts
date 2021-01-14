import parseQuery from "../../../src/parse-query";
import parseComboData from "../../../src/parse-query/parse-combo-data";

jest.mock("../../../src/parse-query/parse-combo-data");

describe("parseQuery", () => {
  it("parses plain text into cards", () => {
    const result = parseQuery("foo bar baz");

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          sizeFilters: [],
          excludeFilters: [],
          includeFilters: [
            {
              method: ":",
              value: "foo",
            },
            {
              method: ":",
              value: "bar",
            },
            {
              method: ":",
              value: "baz",
            },
          ],
        },
      })
    );
  });

  // TODO this should not support this
  it("supports an empty string for query", () => {
    const result = parseQuery("");

    expect(result).toEqual({
      cards: {
        sizeFilters: [],
        includeFilters: [],
        excludeFilters: [],
      },
      colorIdentity: {
        includeFilters: [],
        excludeFilters: [],
        sizeFilters: [],
      },
      prerequisites: {
        include: [],
        exclude: [],
      },
      steps: {
        include: [],
        exclude: [],
      },
      results: {
        include: [],
        exclude: [],
      },
      errors: [],
    });
  });

  it("provides errors", () => {
    const result = parseQuery(
      "foo unknown:value unknown2:'value 2' unknown3:\"value 3\" bar -card>3"
    );

    expect(result).toEqual(
      expect.objectContaining({
        cards: {
          sizeFilters: [],
          excludeFilters: [],
          includeFilters: [
            {
              method: ":",
              value: "foo",
            },
            {
              method: ":",
              value: "bar",
            },
          ],
        },
        errors: [
          {
            key: "unknown",
            value: "value",
            message: 'Could not parse keyword "unknown" with value "value"',
          },
          {
            key: "unknown2",
            value: "value 2",
            message: 'Could not parse keyword "unknown2" with value "value 2"',
          },
          {
            key: "unknown3",
            value: "value 3",
            message: 'Could not parse keyword "unknown3" with value "value 3"',
          },
          {
            key: "-card",
            value: "3",
            message: 'The key "-card" does not support operator ">"',
          },
        ],
      })
    );
  });

  it("can parse a mix of all queries", () => {
    const result = parseQuery(
      "Kiki ci:wbr -ci=br card:Daxos id:12345 card:'Grave Titan' card:\"Akroma\" unknown:value -card:Food prerequisites:prereq steps:step results:result -prerequisites:xprereq -steps:xstep -result:xresult"
    );

    expect(parseComboData).toBeCalledTimes(6);
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "prerequisites",
      ":",
      "prereq"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "-prerequisites",
      ":",
      "xprereq"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "steps",
      ":",
      "step"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "-steps",
      ":",
      "xstep"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "results",
      ":",
      "result"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "-result",
      ":",
      "xresult"
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: "12345",
        cards: {
          sizeFilters: [],
          excludeFilters: [
            {
              method: ":",
              value: "Food",
            },
          ],
          includeFilters: [
            {
              method: ":",
              value: "Kiki",
            },
            {
              method: ":",
              value: "Daxos",
            },
            {
              method: ":",
              value: "Grave Titan",
            },
            {
              method: ":",
              value: "Akroma",
            },
          ],
        },
        colorIdentity: {
          includeFilters: [
            {
              method: ":",
              value: ["w", "b", "r"],
            },
          ],
          excludeFilters: [
            {
              method: "=",
              value: ["b", "r"],
            },
          ],
          sizeFilters: [],
        },
        errors: [
          {
            key: "unknown",
            value: "value",
            message: 'Could not parse keyword "unknown" with value "value"',
          },
        ],
      })
    );
  });

  it("ignores capitalization on keys", () => {
    const result = parseQuery(
      "Kiki CI:wbr CARD:Daxos ID:12345 CARD:'Grave Titan' CARD:\"Akroma\" UNKNOWN:value -CARD:Food PREREQUISITES:prereq STEPS:step RESULTS:result -PREREQUISITES:xprereq -STEPS:xstep -RESULT:xresult"
    );

    expect(parseComboData).toBeCalledTimes(6);
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "prerequisites",
      ":",
      "prereq"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "-prerequisites",
      ":",
      "xprereq"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "steps",
      ":",
      "step"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "-steps",
      ":",
      "xstep"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "results",
      ":",
      "result"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "-result",
      ":",
      "xresult"
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: "12345",
        cards: {
          sizeFilters: [],
          excludeFilters: [
            {
              method: ":",
              value: "Food",
            },
          ],
          includeFilters: [
            {
              method: ":",
              value: "Kiki",
            },
            {
              method: ":",
              value: "Daxos",
            },
            {
              method: ":",
              value: "Grave Titan",
            },
            {
              method: ":",
              value: "Akroma",
            },
          ],
        },
        colorIdentity: {
          includeFilters: [
            {
              method: ":",
              value: ["w", "b", "r"],
            },
          ],
          excludeFilters: [],
          sizeFilters: [],
        },
        errors: [
          {
            key: "unknown",
            value: "value",
            message: 'Could not parse keyword "unknown" with value "value"',
          },
        ],
      })
    );
  });

  it("ignores underscores in keys", () => {
    const result = parseQuery(
      "Kiki c_i:wbr c_ar_d:Daxos i_d:12345 ca_rd:'Grave Titan' ca_rd:\"Akroma\" unknow_n:value -c_ard:Food _prere_quisit_es_:prereq st_eps:step r_esu_lts:result -prer_equisites:xprereq -ste_ps:xstep -res_ult:xresult"
    );

    expect(parseComboData).toBeCalledTimes(6);
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "prerequisites",
      ":",
      "prereq"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "-prerequisites",
      ":",
      "xprereq"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "steps",
      ":",
      "step"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "-steps",
      ":",
      "xstep"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "results",
      ":",
      "result"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      "-result",
      ":",
      "xresult"
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: "12345",
        cards: {
          sizeFilters: [],
          excludeFilters: [
            {
              method: ":",
              value: "Food",
            },
          ],
          includeFilters: [
            {
              method: ":",
              value: "Kiki",
            },
            {
              method: ":",
              value: "Daxos",
            },
            {
              method: ":",
              value: "Grave Titan",
            },
            {
              method: ":",
              value: "Akroma",
            },
          ],
        },
        colorIdentity: {
          includeFilters: [
            {
              method: ":",
              value: ["w", "b", "r"],
            },
          ],
          excludeFilters: [],
          sizeFilters: [],
        },
        errors: [
          {
            key: "unknown",
            value: "value",
            message: 'Could not parse keyword "unknown" with value "value"',
          },
        ],
      })
    );
  });

  it("parses id query into id", () => {
    const result = parseQuery("id:12345");

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        id: "12345",
      })
    );
  });

  it("parses ci query into colorIdentity", () => {
    const result = parseQuery("ci:wbr -ci:br");

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        colorIdentity: {
          includeFilters: [
            {
              method: ":",
              value: ["w", "b", "r"],
            },
          ],
          excludeFilters: [
            {
              method: ":",
              value: ["b", "r"],
            },
          ],
          sizeFilters: [],
        },
      })
    );
  });

  it("parses coloridentity query into colorIdentity", () => {
    const result = parseQuery("coloridentity:wbr -coloridentity:br");

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        colorIdentity: {
          includeFilters: [
            {
              method: ":",
              value: ["w", "b", "r"],
            },
          ],
          excludeFilters: [
            {
              method: ":",
              value: ["b", "r"],
            },
          ],
          sizeFilters: [],
        },
      })
    );
  });

  it("parses card query into cards", () => {
    const result = parseQuery("card:Rashmi");

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          sizeFilters: [],
          excludeFilters: [],
          includeFilters: [
            {
              method: ":",
              value: "Rashmi",
            },
          ],
        },
      })
    );
  });

  it("parses cards query into cards", () => {
    const result = parseQuery("cards:Rashmi");

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          sizeFilters: [],
          excludeFilters: [],
          includeFilters: [
            {
              method: ":",
              value: "Rashmi",
            },
          ],
        },
      })
    );
  });

  it("can parse multiple card queries", () => {
    const result = parseQuery("card:Rashmi cards:Arjun card:Sydri");

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          sizeFilters: [],
          excludeFilters: [],
          includeFilters: [
            {
              method: ":",
              value: "Rashmi",
            },
            {
              method: ":",
              value: "Arjun",
            },
            {
              method: ":",
              value: "Sydri",
            },
          ],
        },
      })
    );
  });

  it("can parse full names with double quotes", () => {
    const result = parseQuery('card:"Rashmi, Eternities Crafter"');

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          sizeFilters: [],
          excludeFilters: [],
          includeFilters: [
            {
              method: ":",
              value: "Rashmi, Eternities Crafter",
            },
          ],
        },
      })
    );
  });

  it("can parse names with apostrophes", () => {
    const result = parseQuery(`card:"Freyalise, Llanowar's Fury"`);

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          sizeFilters: [],
          excludeFilters: [],
          includeFilters: [
            {
              method: ":",
              value: "Freyalise, Llanowar's Fury",
            },
          ],
        },
      })
    );
  });

  it("can parse names with quotes in the name", () => {
    const result = parseQuery(`card:'Kongming, "Sleeping Dragon"'`);

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          sizeFilters: [],
          excludeFilters: [],
          includeFilters: [
            {
              method: ":",
              value: `Kongming, "Sleeping Dragon"`,
            },
          ],
        },
      })
    );
  });

  it("can parse full names with single quotes", () => {
    const result = parseQuery("card:'Rashmi, Eternities Crafter'");

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          sizeFilters: [],
          excludeFilters: [],
          includeFilters: [
            {
              method: ":",
              value: "Rashmi, Eternities Crafter",
            },
          ],
        },
      })
    );
  });

  it("can parse multiple card query types", () => {
    const result = parseQuery(
      "card:'Rashmi, Eternities Crafter' cards:Arjun card:'Sydri, Galvanic'"
    );

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          sizeFilters: [],
          excludeFilters: [],
          includeFilters: [
            {
              method: ":",
              value: "Rashmi, Eternities Crafter",
            },
            {
              method: ":",
              value: "Arjun",
            },
            {
              method: ":",
              value: "Sydri, Galvanic",
            },
          ],
        },
      })
    );
  });

  it("parses negative card query into cards", () => {
    const result = parseQuery(
      "-card:Rashmi -card:Arjun -cards:\"Food\" -card:'Sydri'"
    );

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          sizeFilters: [],
          excludeFilters: [
            {
              method: ":",
              value: "Rashmi",
            },
            {
              method: ":",
              value: "Arjun",
            },
            {
              method: ":",
              value: "Food",
            },
            {
              method: ":",
              value: "Sydri",
            },
          ],
          includeFilters: [],
        },
      })
    );
  });

  it.each([
    "pre",
    "prerequisite",
    "prerequisites",
    "step",
    "steps",
    "res",
    "result",
    "results",
  ])("parses %s through combo data parser", (kind) => {
    parseQuery(
      `${kind}:foo ${kind}:"thing in quotes" -${kind}:"excluded thing"`
    );

    expect(parseComboData).toBeCalledTimes(3);
    expect(parseComboData).toBeCalledWith(expect.anything(), kind, ":", "foo");
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      kind,
      ":",
      "thing in quotes"
    );
    expect(parseComboData).toBeCalledWith(
      expect.anything(),
      `-${kind}`,
      ":",
      "excluded thing"
    );
  });
});
