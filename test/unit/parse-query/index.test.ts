import parseQuery from "../../../src/parse-query";
import parseCardQuery from "../../../src/parse-query/parse-card-query";
import parseColorIdentity from "../../../src/parse-query/parse-color-identity";
import parseComboData from "../../../src/parse-query/parse-combo-data";

jest.mock("../../../src/parse-query/parse-card-query");
jest.mock("../../../src/parse-query/parse-color-identity");
jest.mock("../../../src/parse-query/parse-combo-data");

describe("parseQuery", () => {
  it("parses plain text into cards", () => {
    parseQuery("foo bar baz");

    expect(parseCardQuery).toBeCalledTimes(3);
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "foo"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "bar"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "baz"
    );
  });

  // TODO this should not support this
  it("supports an empty string for query", () => {
    const result = parseQuery("");

    expect(parseCardQuery).not.toBeCalled();
    expect(parseColorIdentity).not.toBeCalled();
    expect(parseComboData).not.toBeCalled();

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

    expect(parseCardQuery).toBeCalledTimes(3);
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "foo"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "bar"
    );
    expect(parseCardQuery).toBeCalledWith(expect.anything(), "-card", ">", "3");

    expect(result).toEqual(
      expect.objectContaining({
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
        ],
      })
    );
  });

  it("can parse a mix of all queries", () => {
    const result = parseQuery(
      "Kiki ci:wbr -ci=br card:Daxos card:'Grave Titan' card:\"Akroma\" unknown:value -card:Food prerequisites:prereq steps:step results:result -prerequisites:xprereq -steps:xstep -result:xresult"
    );

    expect(parseCardQuery).toBeCalledTimes(5);
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "Kiki"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "Daxos"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "Grave Titan"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "Akroma"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "-card",
      ":",
      "Food"
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

    expect(parseColorIdentity).toBeCalledTimes(2);
    expect(parseColorIdentity).toBeCalledWith(
      expect.anything(),
      "ci",
      ":",
      "wbr"
    );
    expect(parseColorIdentity).toBeCalledWith(
      expect.anything(),
      "-ci",
      "=",
      "br"
    );

    expect(result).toEqual(
      expect.objectContaining({
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
      "Kiki CI:wbr CARD:Daxos CARD:'Grave Titan' CARD:\"Akroma\" UNKNOWN:value -CARD:Food PREREQUISITES:prereq STEPS:step RESULTS:result -PREREQUISITES:xprereq -STEPS:xstep -RESULT:xresult"
    );

    expect(parseCardQuery).toBeCalledTimes(5);
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "Kiki"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "Daxos"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "Grave Titan"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "Akroma"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "-card",
      ":",
      "Food"
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

    expect(parseColorIdentity).toBeCalledTimes(1);
    expect(parseColorIdentity).toBeCalledWith(
      expect.anything(),
      "ci",
      ":",
      "wbr"
    );

    expect(result).toEqual(
      expect.objectContaining({
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
      "Kiki c_i:wbr c_ar_d:Daxos ca_rd:'Grave Titan' ca_rd:\"Akroma\" unknow_n:value -c_ard:Food _prere_quisit_es_:prereq st_eps:step r_esu_lts:result -prer_equisites:xprereq -ste_ps:xstep -res_ult:xresult"
    );

    expect(parseCardQuery).toBeCalledTimes(5);
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "Kiki"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "Daxos"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "Grave Titan"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "Akroma"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "-card",
      ":",
      "Food"
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

    expect(parseColorIdentity).toBeCalledTimes(1);
    expect(parseColorIdentity).toBeCalledWith(
      expect.anything(),
      "ci",
      ":",
      "wbr"
    );

    expect(result).toEqual(
      expect.objectContaining({
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

  it.each(["ci", "coloridentity"])(
    "parses %s into color identity parses",
    (kind) => {
      parseQuery(`${kind}:wbr -${kind}:br`);

      expect(parseColorIdentity).toBeCalledTimes(2);
      expect(parseColorIdentity).toBeCalledWith(
        expect.anything(),
        kind,
        ":",
        "wbr"
      );
      expect(parseColorIdentity).toBeCalledWith(
        expect.anything(),
        `-${kind}`,
        ":",
        "br"
      );
    }
  );

  it.each(["card", "cards"])("parses %s into card query parser", (kind) => {
    parseQuery(
      `${kind}:Rashmi ${kind}:"with quotes", -${kind}:'excluded thing'`
    );

    expect(parseCardQuery).toBeCalledTimes(3);
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      kind,
      ":",
      "Rashmi"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      kind,
      ":",
      "with quotes"
    );
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      `-${kind}`,
      ":",
      "excluded thing"
    );
  });

  it("can parse names with apostrophes", () => {
    parseQuery(`card:"Freyalise, Llanowar's Fury"`);

    expect(parseCardQuery).toBeCalledTimes(1);
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      "Freyalise, Llanowar's Fury"
    );
  });

  it("can parse names with quotes in the name", () => {
    parseQuery(`card:'Kongming, "Sleeping Dragon"'`);

    expect(parseCardQuery).toBeCalledTimes(1);
    expect(parseCardQuery).toBeCalledWith(
      expect.anything(),
      "card",
      ":",
      `Kongming, "Sleeping Dragon"`
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
