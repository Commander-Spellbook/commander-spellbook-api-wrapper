"use strict";

import spellbook = require("../../src/");

describe("Commander Spellbook", () => {
  afterAll(() => {
    // if we don't do this after the tests complete,
    // the test hangs as we're holding onto a reference
    // to the promise of the reesolved API response
    spellbook.resetCache();
  });

  it("looks up specific cards", async () => {
    const combos = await spellbook.search({
      cards: ["Sydri"],
    });

    expect(combos.length).toBeGreaterThan(0);
    combos.forEach((combo) => {
      const hasSydriInCombo = combo.cards.find(
        (card) => card === "Sydri, Galvanic Genius"
      );

      expect(hasSydriInCombo).toBeTruthy();
    });
  });
});
