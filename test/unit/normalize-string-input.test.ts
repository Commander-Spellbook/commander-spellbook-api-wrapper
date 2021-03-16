import normalizeStringInput from "../../src/normalize-string-input";

describe("normalizeStringInput", () => {
  it("lowercases", async () => {
    const result = await normalizeStringInput("ASDF");

    expect(result).toBe("asdf");
  });

  it("removes all non-alphanumeric and space characters", async () => {
    const result = await normalizeStringInput("a3_! B2");

    expect(result).toBe("a3 b2");
  });

  it("trims trailing space, but preserves inner space", async () => {
    const result = await normalizeStringInput("   @a3_!    B2   ");

    expect(result).toBe("a3    b2");
  });
});
