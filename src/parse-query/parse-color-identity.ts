import type { ColorIdentityColors } from "../types";

export default function parseColorIdentity(val: string): ColorIdentityColors[] {
  const normalizedValue = val.replace(/[\s-]/g, "").toLowerCase();

  switch (normalizedValue) {
    case "c":
    case "colorless":
      return ["c"];
    case "white":
    case "monowhite":
      return ["w"];
    case "blue":
    case "monoblue":
      return ["u"];
    case "black":
    case "monoblack":
      return ["b"];
    case "red":
    case "monored":
      return ["r"];
    case "green":
    case "monogreen":
      return ["g"];
    case "azorius":
      return ["w", "u"];
    case "dimir":
      return ["u", "b"];
    case "rakdos":
      return ["b", "r"];
    case "gruul":
      return ["r", "g"];
    case "selesnya":
      return ["w", "g"];
    case "orzhov":
      return ["w", "b"];
    case "izzet":
      return ["u", "r"];
    case "golgari":
      return ["b", "g"];
    case "boros":
      return ["w", "r"];
    case "simic":
      return ["u", "g"];
    case "naya":
      return ["w", "r", "g"];
    case "esper":
      return ["w", "u", "b"];
    case "grixis":
      return ["u", "b", "r"];
    case "jund":
      return ["b", "r", "g"];
    case "bant":
      return ["w", "u", "g"];
    case "abzan":
      return ["w", "b", "g"];
    case "temur":
      return ["u", "r", "g"];
    case "jeskai":
      return ["w", "u", "r"];
    case "mardu":
      return ["w", "b", "r"];
    case "sultai":
      return ["b", "u", "g"];
    case "glint":
    case "sanswhite":
      return ["u", "b", "r", "g"];
    case "dune":
    case "sansblue":
      return ["w", "b", "r", "g"];
    case "ink":
    case "sansblack":
      return ["w", "u", "r", "g"];
    case "witch":
    case "sansred":
      return ["w", "u", "b", "g"];
    case "yore":
    case "sansgreen":
      return ["w", "u", "b", "r"];
    case "fivecolor":
      return ["w", "u", "b", "r", "g"];
  }

  const matches = normalizedValue.match(/[wubrg]/g);

  if (!matches) {
    return [];
  }

  const uniqueMatches = new Set(matches);

  return Array.from(uniqueMatches) as ColorIdentityColors[];
}
