"use strict";

import spellbook = require("../../src/");

describe("Commander Spellbook", () => {
  describe("findById", () => {
    it("returns a specified combo", async () => {
      const combo = await spellbook.findById("1");

      expect(combo.commanderSpellbookId).toBeTruthy();
      expect(combo.permalink).toBeTruthy();
      expect(combo.cards).toBeTruthy();
      expect(combo.colorIdentity).toBeTruthy();
      expect(combo.prerequisites).toBeTruthy();
      expect(combo.steps).toBeTruthy();
      expect(combo.results).toBeTruthy();
    });

    it("rejects when combo does not exist", async () => {
      expect.assertions(1);

      try {
        await spellbook.findById("does-not-exist");
      } catch (err) {
        expect(err.message).toBe(
          'Combo with id "does-not-exist" could not be found.'
        );
      }
    });
  });

  describe("search", () => {
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

    describe("color identity", () => {
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

      it("looks up exact color combos", async () => {
        const combos = await spellbook.search("ci=wr");

        expect(combos.length).toBeGreaterThan(0);
        combos.forEach((combo) => {
          expect(combo.colorIdentity.colors).toEqual(["w", "r"]);
        });
      });

      it("looks up greater than color combos", async () => {
        const combos = await spellbook.search("ci>wr");

        expect(combos.length).toBeGreaterThan(0);
        combos.forEach((combo) => {
          const { colors } = combo.colorIdentity;
          expect(colors.length).toBeGreaterThan(2);
          expect(colors).toContain("w");
          expect(colors).toContain("r");
        });
      });

      it("looks up greater than or equal color combos", async () => {
        const combos = await spellbook.search("ci>=wr");

        let hasExactMatch = false;

        expect(combos.length).toBeGreaterThan(0);
        combos.forEach((combo) => {
          const { colors } = combo.colorIdentity;
          expect(colors.length).toBeGreaterThan(1);
          expect(colors).toContain("w");
          expect(colors).toContain("r");

          if (colors.length === 2) {
            hasExactMatch = true;
          }
        });

        expect(hasExactMatch).toBe(true);
      });

      it("looks up less than color combos", async () => {
        const combos = await spellbook.search("ci<wru");

        expect(combos.length).toBeGreaterThan(0);
        combos.forEach((combo) => {
          const { colors } = combo.colorIdentity;
          expect(colors.length).toBeLessThan(3);
          expect(
            colors.every((item) => {
              const containsItem =
                item === "c" || item === "w" || item === "r" || item == "u";
              const doesNotContain = item !== "b" && item !== "g";

              return containsItem && doesNotContain;
            })
          ).toBe(true);
        });
      });

      it("looks up less than or equal color combos", async () => {
        const combos = await spellbook.search("ci<=wru");

        let hasExactMatch = false;

        expect(combos.length).toBeGreaterThan(0);
        combos.forEach((combo) => {
          const { colors } = combo.colorIdentity;
          expect(colors.length).toBeLessThan(4);
          expect(
            colors.every((item) => {
              const containsItem =
                item === "c" || item === "w" || item === "r" || item == "u";
              const doesNotContain = item !== "b" && item !== "g";

              return containsItem && doesNotContain;
            })
          ).toBe(true);

          if (colors.length === 3) {
            hasExactMatch = true;
          }
        });

        expect(hasExactMatch).toBe(true);
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
        return combo.steps.find(
          (step) => step.toLowerCase().indexOf("tap") > -1
        );
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

  describe("random", () => {
    it("returns a random combo", async () => {
      const combo = await spellbook.random();

      expect(combo.commanderSpellbookId).toBeTruthy();
      expect(combo.permalink).toBeTruthy();
      expect(combo.cards).toBeTruthy();
      expect(combo.colorIdentity).toBeTruthy();
      expect(combo.prerequisites).toBeTruthy();
      expect(combo.steps).toBeTruthy();
      expect(combo.results).toBeTruthy();
    });
  });
});
