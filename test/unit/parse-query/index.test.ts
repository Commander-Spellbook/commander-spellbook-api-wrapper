import parseQuery from "../../../src/parse-query";

describe("parseQuery", () => {
  it("parses plain text into cards", () => {
    const result = parseQuery("foo bar baz");

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          exclude: [],
          include: ["foo", "bar", "baz"],
        },
      })
    );
  });

  it("supports an empty string for query", () => {
    const result = parseQuery("");

    expect(result).toEqual({
      cards: {
        include: [],
        exclude: [],
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
      "foo unknown:value unknown2:'value 2' unknown3:\"value 3\" bar"
    );

    expect(result).toEqual(
      expect.objectContaining({
        cards: {
          exclude: [],
          include: ["foo", "bar"],
        },
        errors: [
          {
            key: "unknown",
            value: "value",
            message: 'Could not parse keyword "unknown" with value "value"',
          },
          {
            key: "unknown3",
            value: "value 3",
            message: 'Could not parse keyword "unknown3" with value "value 3"',
          },
          {
            key: "unknown2",
            value: "value 2",
            message: 'Could not parse keyword "unknown2" with value "value 2"',
          },
        ],
      })
    );
  });

  it("can parse a mix of all queries", () => {
    const result = parseQuery(
      "Kiki ci:wbr card:Daxos id:12345 card:'Grave Titan' card:\"Akroma\" unknown:value -card:Food prerequisites:prereq steps:step results:result -prerequisites:xprereq -steps:xstep -result:xresult"
    );

    expect(result).toEqual({
      id: "12345",
      cards: {
        exclude: ["Food"],
        include: ["Kiki", "Daxos", "Akroma", "Grave Titan"],
      },
      colorIdentity: ["w", "b", "r"],
      prerequisites: {
        include: ["prereq"],
        exclude: ["xprereq"],
      },
      steps: {
        include: ["step"],
        exclude: ["xstep"],
      },
      results: {
        include: ["result"],
        exclude: ["xresult"],
      },
      errors: [
        {
          key: "unknown",
          value: "value",
          message: 'Could not parse keyword "unknown" with value "value"',
        },
      ],
    });
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
    const result = parseQuery("ci:wbr");

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        colorIdentity: ["w", "b", "r"],
      })
    );
  });

  it("parses color_identity query into colorIdentity", () => {
    const result = parseQuery("color_identity:wbr");

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        colorIdentity: ["w", "b", "r"],
      })
    );
  });

  it("parses coloridentity query into colorIdentity", () => {
    const result = parseQuery("coloridentity:wbr");

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        colorIdentity: ["w", "b", "r"],
      })
    );
  });

  it("uses only the last ci/color_identity param", () => {
    const result = parseQuery("ci:w color_identity:ru ci:gr");

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        colorIdentity: ["g", "r"],
      })
    );
  });

  it("parses card query into cards", () => {
    const result = parseQuery("card:Rashmi");

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          exclude: [],
          include: ["Rashmi"],
        },
      })
    );
  });

  it("can parse multiple card queries", () => {
    const result = parseQuery("card:Rashmi card:Arjun card:Sydri");

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          exclude: [],
          include: ["Rashmi", "Arjun", "Sydri"],
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
          exclude: [],
          include: ["Rashmi, Eternities Crafter"],
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
          exclude: [],
          include: ["Freyalise, Llanowar's Fury"],
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
          exclude: [],
          include: [`Kongming, "Sleeping Dragon"`],
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
          exclude: [],
          include: ["Rashmi, Eternities Crafter"],
        },
      })
    );
  });

  it("can parse multiple card query types", () => {
    const result = parseQuery(
      "card:'Rashmi, Eternities Crafter' card:Arjun card:'Sydri, Galvanic'"
    );

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          exclude: [],
          include: ["Arjun", "Rashmi, Eternities Crafter", "Sydri, Galvanic"],
        },
      })
    );
  });

  it("parses negative card query into cards", () => {
    const result = parseQuery(
      "-card:Rashmi -card:Arjun -card:\"Food\" -card:'Sydri'"
    );

    expect(result).toEqual(
      expect.objectContaining({
        errors: [],
        cards: {
          exclude: ["Rashmi", "Arjun", "Food", "Sydri"],
          include: [],
        },
      })
    );
  });

  it.each(["prerequisites", "steps", "results"])("parses %s", (kind) => {
    const result = parseQuery(
      `${kind}:foo ${kind}:"thing in quotes" -${kind}:"excluded thing"`
    );

    expect(result).toEqual(
      expect.objectContaining({
        [kind]: {
          exclude: ["excluded thing"],
          include: ["foo", "thing in quotes"],
        },
        errors: [],
      })
    );
  });

  it.each(["prerequisite", "step", "result"])(
    "parses %ss in singluar form",
    (kind) => {
      const result = parseQuery(
        `${kind}:foo ${kind}:"thing in quotes" -${kind}:"excluded thing"`
      );

      expect(result).toEqual(
        expect.objectContaining({
          [`${kind}s`]: {
            exclude: ["excluded thing"],
            include: ["foo", "thing in quotes"],
          },
          errors: [],
        })
      );
    }
  );

  it("parses pre as prerequisites", () => {
    const result = parseQuery(
      `pre:foo pre:"thing in quotes" -pre:"excluded thing"`
    );

    expect(result).toEqual(
      expect.objectContaining({
        prerequisites: {
          exclude: ["excluded thing"],
          include: ["foo", "thing in quotes"],
        },
        errors: [],
      })
    );
  });
});
