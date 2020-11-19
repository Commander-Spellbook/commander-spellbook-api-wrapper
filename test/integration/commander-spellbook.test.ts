"use strict";

import spellbook = require("../../src/");

describe("Commander Spellbook", () => {
  afterAll(() => {
    // if we don't do this after the tests complete,
    // the test hangs as we're holding onto a reference
    // to the promise of the reesolved API response
    spellbook.resetCache();
  });

  it("looks up all combos", async () => {
    const combos = await spellbook.search("");

    expect(combos.length).toBeGreaterThan(0);
  });

  it("looks up specific id", async () => {
    const combos = await spellbook.search("id:123");

    expect(combos.length).toBe(1);
    expect(combos[0].commanderSpellbookId).toBe("123");
  });

  it("looks up specific cards", async () => {
    const combos = await spellbook.search("Sydri");

    expect(combos.length).toBeGreaterThan(0);
    combos.forEach((combo) => {
      const hasSydriInCombo = combo.cards.find(
        (card) => card.name === "Sydri, Galvanic Genius"
      );

      expect(hasSydriInCombo).toBeTruthy();
    });
  });

  it("can filter out specific cards", async () => {
    const combos = await spellbook.search("-card:Sydri");

    expect(combos.length).toBeGreaterThan(0);
    combos.forEach((combo) => {
      const hasSydriInCombo = combo.cards.find(
        (card) => card.name === "Sydri, Galvanic Genius"
      );

      expect(hasSydriInCombo).toBeFalsy();
    });
  });

  it("looks up specific color combos", async () => {
    const combos = await spellbook.search("ci:wr");

    expect(combos.length).toBeGreaterThan(0);
    combos.forEach((combo) => {
      const hasOffColorCombo = combo.colorIdentity.colors.find(
        (color) => color !== "w" && color !== "r" && color !== "c"
      );

      expect(hasOffColorCombo).toBeFalsy();
    });
  });
});
