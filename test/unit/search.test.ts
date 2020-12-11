import search from "../../src/search";
import lookup from "../../src/spellbook-api";
import CardGrouping from "../../src/models/card-grouping";
import SpellbookList from "../../src/models/list";
import ColorIdentity from "../../src/models/color-identity";

import { mocked } from "ts-jest/utils";
jest.mock("../../src/spellbook-api");

describe("search", () => {
  beforeEach(() => {
    mocked(lookup).mockResolvedValue([
      {
        commanderSpellbookId: "1",
        permalink: "https://commanderspellbook.com/?id=1",
        cards: CardGrouping.create(["Card 1", "Card 2"]),
        colorIdentity: new ColorIdentity("r,g"),
        prerequisites: SpellbookList.create("Step 1. Step 2"),
        steps: SpellbookList.create("Step 1. Step 2"),
        results: SpellbookList.create("Step 1. Step 2"),
      },
    ]);

    jest.spyOn(CardGrouping.prototype, "matches");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("looks up combos from api", async () => {
    await search("");

    expect(lookup).toBeCalledTimes(1);
  });

  it("can filter by cards", async () => {
    await search("Sydri Arjun Rashmi");

    expect(CardGrouping.prototype.matches).toBeCalledTimes(1);
    expect(CardGrouping.prototype.matches).toBeCalledWith([
      "Sydri",
      "Arjun",
      "Rashmi",
    ]);
  });

  it("can filter out cards", async () => {
    await search("-card:Sydri");

    expect(CardGrouping.prototype.matches).toBeCalledTimes(1);
    expect(CardGrouping.prototype.matches).toBeCalledWith(["Sydri"]);
  });

  describe("color identity", () => {
    it("can filter by color identity array with : operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "isWithin").mockReturnValue(true);
      jest.spyOn(ColorIdentity.prototype, "is");

      await search("ci:grw");

      expect(ColorIdentity.prototype.isWithin).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.isWithin).toBeCalledWith(["g", "r", "w"]);
      expect(ColorIdentity.prototype.is).not.toBeCalled();
    });

    it("can filter by color identity array with >= operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "includes").mockReturnValue(true);
      jest.spyOn(ColorIdentity.prototype, "is");

      await search("ci>=grw");

      expect(ColorIdentity.prototype.includes).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.includes).toBeCalledWith(["g", "r", "w"]);
      expect(ColorIdentity.prototype.is).not.toBeCalled();
    });

    it("can filter by color identity array with > operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "includes").mockReturnValue(true);
      jest.spyOn(ColorIdentity.prototype, "is");

      await search("ci>grw");

      expect(ColorIdentity.prototype.includes).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.includes).toBeCalledWith(["g", "r", "w"]);
      expect(ColorIdentity.prototype.is).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.is).toBeCalledWith(["g", "r", "w"]);
    });

    it("can filter by color identity array with < operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "isWithin").mockReturnValue(true);
      jest.spyOn(ColorIdentity.prototype, "is");

      await search("ci<grw");

      expect(ColorIdentity.prototype.isWithin).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.isWithin).toBeCalledWith(["g", "r", "w"]);
      expect(ColorIdentity.prototype.is).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.is).toBeCalledWith(["g", "r", "w"]);
    });

    it("can filter by color identity array with <= operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "isWithin").mockReturnValue(true);
      jest.spyOn(ColorIdentity.prototype, "is");

      await search("ci<=grw");

      expect(ColorIdentity.prototype.isWithin).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.isWithin).toBeCalledWith(["g", "r", "w"]);
      expect(ColorIdentity.prototype.is).not.toBeCalled();
    });

    it("can filter by color identity array with = operator", async () => {
      jest.spyOn(ColorIdentity.prototype, "is").mockReturnValue(true);

      await search("ci=grw");

      expect(ColorIdentity.prototype.is).toBeCalledTimes(1);
      expect(ColorIdentity.prototype.is).toBeCalledWith(["g", "r", "w"]);
    });
  });
});
