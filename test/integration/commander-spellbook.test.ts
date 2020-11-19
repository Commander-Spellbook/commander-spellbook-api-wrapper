"use strict";

import spellbook = require("../../src/");

describe("Commander Spellbook", () => {
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

  it("looks up specific prequisite in combos", async () => {
    const combos = await spellbook.search("prerequisites:permanents");

    expect(combos.length).toBeGreaterThan(0);
    const hasWordPermanentsInComboPreq = combos.every((combo) => {
      return combo.prerequisites.find(
        (prereq) => prereq.toLowerCase().indexOf("permanents") > -1
      );
    });

    expect(hasWordPermanentsInComboPreq).toBeTruthy();
  });

  it("looks up specific step in combos", async () => {
    const combos = await spellbook.search("steps:Tap");

    expect(combos.length).toBeGreaterThan(0);
    const hasWordTapInSteps = combos.every((combo) => {
      return combo.steps.find((step) => step.toLowerCase().indexOf("tap") > -1);
    });

    expect(hasWordTapInSteps).toBeTruthy();
  });

  it("looks up specific result in combos", async () => {
    const combos = await spellbook.search("results:Infinite");

    expect(combos.length).toBeGreaterThan(0);
    const hasWordInfiniteInResult = combos.every((combo) => {
      return combo.results.find(
        (res) => res.toLowerCase().indexOf("infinite") > -1
      );
    });

    expect(hasWordInfiniteInResult).toBeTruthy();
  });
});
