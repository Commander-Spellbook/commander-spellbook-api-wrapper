import search from "../../src/search";
import lookup from "../../src/spellbook-api";
import filterByCards from "../../src/filter-by-cards";
import filterByColorIdentity from "../../src/filter-by-color-identity";

jest.mock("../../src/spellbook-api");
jest.mock("../../src/filter-by-cards");
jest.mock("../../src/filter-by-color-identity");

describe("search", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("looks up combos from api", async () => {
    await search();

    expect(lookup).toBeCalledTimes(1);
  });

  it("can filter by cards", async () => {
    await search({
      cards: ["Sydri", "Arjun", "Rashmi"],
    });

    expect(filterByCards).toBeCalledTimes(1);
    expect(filterByCards).toBeCalledWith(
      ["Sydri", "Arjun", "Rashmi"],
      expect.anything()
    );
  });

  it("can filter by color identity array", async () => {
    await search({
      colorIdentity: ["g", "r", "w"],
    });

    expect(filterByColorIdentity).toBeCalledTimes(1);
    expect(filterByColorIdentity).toBeCalledWith(
      ["g", "r", "w"],
      expect.anything()
    );
  });

  it("can filter by color identity string", async () => {
    await search({
      colorIdentity: "g,r,w",
    });

    expect(filterByColorIdentity).toBeCalledTimes(1);
    expect(filterByColorIdentity).toBeCalledWith(
      ["g", "r", "w"],
      expect.anything()
    );
  });

  it("can filter by color identity string with spaces", async () => {
    await search({
      colorIdentity: "g r w",
    });

    expect(filterByColorIdentity).toBeCalledTimes(1);
    expect(filterByColorIdentity).toBeCalledWith(
      ["g", "r", "w"],
      expect.anything()
    );
  });

  it("can filter by color identity without deliminator", async () => {
    await search({
      colorIdentity: "grw",
    });

    expect(filterByColorIdentity).toBeCalledTimes(1);
    expect(filterByColorIdentity).toBeCalledWith(
      ["g", "r", "w"],
      expect.anything()
    );
  });
});
