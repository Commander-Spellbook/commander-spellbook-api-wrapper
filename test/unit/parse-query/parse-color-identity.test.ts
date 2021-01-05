import parseColorIdentity from "../../../src/parse-query/parse-color-identity";

describe("parseColorIdentity", () => {
  it("returns an empty array when nothing matches", () => {
    const input = "acdefhijklmnopqstvxyz";

    expect(parseColorIdentity(input)).toEqual([]);
  });

  it("pulls out only acceptable colors", () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    expect(parseColorIdentity(alphabet)).toEqual(["b", "g", "r", "u", "w"]);
  });

  it("ignores duplicates", () => {
    const input = "wwwuuuwwwwb";

    expect(parseColorIdentity(input)).toEqual(["w", "u", "b"]);
  });

  it.each`
    name            | expectedResult
    ${"c"}          | ${"c"}
    ${"Colorless"}  | ${"c"}
    ${"White"}      | ${"w"}
    ${"Blue"}       | ${"u"}
    ${"Black"}      | ${"b"}
    ${"Red"}        | ${"r"}
    ${"Green"}      | ${"g"}
    ${"MonoWhite"}  | ${"w"}
    ${"MonoBlue"}   | ${"u"}
    ${"MonoBlack"}  | ${"b"}
    ${"MonoRed"}    | ${"r"}
    ${"MonoGreen"}  | ${"g"}
    ${"Mono White"} | ${"w"}
    ${"Mono Blue"}  | ${"u"}
    ${"Mono Black"} | ${"b"}
    ${"Mono Red"}   | ${"r"}
    ${"Mono Green"} | ${"g"}
    ${"Mono-White"} | ${"w"}
    ${"Mono-Blue"}  | ${"u"}
    ${"Mono-Black"} | ${"b"}
    ${"Mono-Red"}   | ${"r"}
    ${"Mono-Green"} | ${"g"}
    ${"Azorius"}    | ${"wu"}
    ${"Dimir"}      | ${"ub"}
    ${"Rakdos"}     | ${"br"}
    ${"Gruul"}      | ${"rg"}
    ${"Selesnya"}   | ${"wg"}
    ${"Orzhov"}     | ${"wb"}
    ${"Izzet"}      | ${"ur"}
    ${"Golgari"}    | ${"bg"}
    ${"Boros"}      | ${"wr"}
    ${"Simic"}      | ${"ug"}
    ${"Naya"}       | ${"wrg"}
    ${"Esper"}      | ${"wub"}
    ${"Grixis"}     | ${"ubr"}
    ${"Jund"}       | ${"brg"}
    ${"Bant"}       | ${"wug"}
    ${"Abzan"}      | ${"wbg"}
    ${"Temur"}      | ${"urg"}
    ${"Jeskai"}     | ${"wur"}
    ${"Mardu"}      | ${"wbr"}
    ${"Sultai"}     | ${"bug"}
    ${"Glint"}      | ${"ubrg"}
    ${"Dune"}       | ${"wbrg"}
    ${"Ink"}        | ${"wurg"}
    ${"Witch"}      | ${"wubg"}
    ${"Yore"}       | ${"wubr"}
    ${"Sans White"} | ${"ubrg"}
    ${"Sans Blue"}  | ${"wbrg"}
    ${"Sans Black"} | ${"wurg"}
    ${"Sans Red"}   | ${"wubg"}
    ${"Sans Green"} | ${"wubr"}
    ${"Sans-White"} | ${"ubrg"}
    ${"Sans-Blue"}  | ${"wbrg"}
    ${"Sans-Black"} | ${"wurg"}
    ${"Sans-Red"}   | ${"wubg"}
    ${"Sans-Green"} | ${"wubr"}
    ${"Five Color"} | ${"wubrg"}
    ${"FiveColor"}  | ${"wubrg"}
  `("reads $name as $expectedResult", ({ name, expectedResult }) => {
    expect(parseColorIdentity(name)).toEqual(expectedResult.split(""));
  });

  it("ignores casing", () => {
    expect(parseColorIdentity("AbzAn")).toEqual(["w", "b", "g"]);
    expect(parseColorIdentity("wUb")).toEqual(["w", "u", "b"]);
  });
});
