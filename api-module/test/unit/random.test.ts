import random from "../../src/random";
import lookup from "../../src/spellbook-api";
import makeFakeCombo from "../../src/make-fake-combo";

import type { FormattedApiResponse } from "../../src/types";

import { mocked } from "ts-jest/utils";
jest.mock("../../src/spellbook-api");

describe("random", () => {
  let combos: FormattedApiResponse[];

  beforeEach(() => {
    combos = [makeFakeCombo(), makeFakeCombo()];
    mocked(lookup).mockResolvedValue(combos);
  });

  it("looks up combos from api", async () => {
    await random();

    expect(lookup).toBeCalledTimes(1);
  });

  it("returns a random combo", async () => {
    jest.spyOn(Math, "floor");
    jest.spyOn(Math, "random");

    const combo = await random();

    expect(combos).toContain(combo);
    expect(Math.floor).toBeCalledTimes(1);
    expect(Math.random).toBeCalledTimes(1);
  });
});
