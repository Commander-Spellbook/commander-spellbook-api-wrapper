import getAllCombos from "../../src/get-all-combos";
import lookup from "../../src/spellbook-api";
import makeFakeCombo from "../../src/make-fake-combo";

import type { FormattedApiResponse } from "../../src/types";

import { mocked } from "ts-jest/utils";
jest.mock("../../src/spellbook-api");

describe("getAllCombos", () => {
  let combos: FormattedApiResponse[];

  beforeEach(() => {
    combos = [makeFakeCombo(), makeFakeCombo()];
    mocked(lookup).mockResolvedValue(combos);
  });

  it("looks up all combos from api", async () => {
    const result = await getAllCombos();

    expect(lookup).toBeCalledTimes(1);

    expect(result).toBe(combos);
  });
});
