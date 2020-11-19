import parseQuery from "../../src/parse-query";

describe("parseQuery", () => {
  it("parses plain text into cards", () => {
    const result = parseQuery("foo bar baz");

    expect(result).toEqual({
      cards: {
        exclude: [],
        include: ["foo", "bar", "baz"],
      },
      errors: [],
    });
  });

  it("supports an empty string for query", () => {
    const result = parseQuery("");

    expect(result).toEqual({
      cards: {
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

    expect(result).toEqual({
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
    });
  });

  it("can parse a mix of all queries", () => {
    const result = parseQuery(
      "Kiki ci:wbr card:Daxos id:12345 card:'Grave Titan' card:\"Akroma\" unknown:value"
    );

    expect(result).toEqual({
      id: "12345",
      cards: {
        exclude: [],
        include: ["Kiki", "Daxos", "Akroma", "Grave Titan"],
      },
      colorIdentity: ["w", "b", "r"],
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

    expect(result).toEqual({
      cards: { exclude: [], include: [] },
      id: "12345",
      errors: [],
    });
  });

  it("parses ci query into colorIdentity", () => {
    const result = parseQuery("ci:wbr");

    expect(result).toEqual({
      cards: { exclude: [], include: [] },
      colorIdentity: ["w", "b", "r"],
      errors: [],
    });
  });

  it("parses color_identity query into colorIdentity", () => {
    const result = parseQuery("color_identity:wbr");

    expect(result).toEqual({
      cards: { exclude: [], include: [] },
      colorIdentity: ["w", "b", "r"],
      errors: [],
    });
  });

  it("parses coloridentity query into colorIdentity", () => {
    const result = parseQuery("coloridentity:wbr");

    expect(result).toEqual({
      cards: { exclude: [], include: [] },
      colorIdentity: ["w", "b", "r"],
      errors: [],
    });
  });

  it("uses only the last ci/color_identity param", () => {
    const result = parseQuery("ci:w color_identity:ru ci:gr");

    expect(result).toEqual({
      cards: { exclude: [], include: [] },
      colorIdentity: ["g", "r"],
      errors: [],
    });
  });

  it("parses card query into cards", () => {
    const result = parseQuery("card:Rashmi");

    expect(result).toEqual({
      cards: {
        exclude: [],
        include: ["Rashmi"],
      },
      errors: [],
    });
  });

  it("can parse multiple card queries", () => {
    const result = parseQuery("card:Rashmi card:Arjun card:Sydri");

    expect(result).toEqual({
      cards: {
        exclude: [],
        include: ["Rashmi", "Arjun", "Sydri"],
      },
      errors: [],
    });
  });

  it("can parse full names with double quotes", () => {
    const result = parseQuery('card:"Rashmi, Eternities Crafter"');

    expect(result).toEqual({
      cards: {
        exclude: [],
        include: ["Rashmi, Eternities Crafter"],
      },
      errors: [],
    });
  });

  it("can parse names with apostrophes", () => {
    const result = parseQuery(`card:"Freyalise, Llanowar's Fury"`);

    expect(result).toEqual({
      cards: {
        exclude: [],
        include: ["Freyalise, Llanowar's Fury"],
      },
      errors: [],
    });
  });

  it("can parse names with quotes in the name", () => {
    const result = parseQuery(`card:'Kongming, "Sleeping Dragon"'`);

    expect(result).toEqual({
      cards: {
        exclude: [],
        include: [`Kongming, "Sleeping Dragon"`],
      },
      errors: [],
    });
  });

  it("can parse full names with single quotes", () => {
    const result = parseQuery("card:'Rashmi, Eternities Crafter'");

    expect(result).toEqual({
      cards: {
        exclude: [],
        include: ["Rashmi, Eternities Crafter"],
      },
      errors: [],
    });
  });

  it("can parse multiple card query types", () => {
    const result = parseQuery(
      "card:'Rashmi, Eternities Crafter' card:Arjun card:'Sydri, Galvanic'"
    );

    expect(result).toEqual({
      cards: {
        exclude: [],
        include: ["Arjun", "Rashmi, Eternities Crafter", "Sydri, Galvanic"],
      },
      errors: [],
    });
  });

  it("parses negative card query into cards", () => {
    const result = parseQuery(
      "-card:Rashmi -card:Arjun -card:\"Food\" -card:'Sydri'"
    );

    expect(result).toEqual({
      cards: {
        exclude: ["Rashmi", "Arjun", "Food", "Sydri"],
        include: [],
      },
      errors: [],
    });
  });
});
