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
    it("looks up specific id", async () => {
      const { combos } = await spellbook.search("id:123");

      expect(combos.length).toBe(1);
      expect(combos[0].commanderSpellbookId).toBe("123");
    });

    it("can exclude ids", async () => {
      const { combos } = await spellbook.search("-id:123");

      expect(combos.length).toBeGreaterThan(0);
      combos.forEach((combo) => {
        expect(combo.commanderSpellbookId).not.toBe("123");
      });
    });

    it("looks up specific cards", async () => {
      const { combos } = await spellbook.search("Sydri");

      expect(combos.length).toBeGreaterThan(0);
      combos.forEach((combo) => {
        const hasSydriInCombo = combo.cards.find(
          (card) => card.name === "Sydri, Galvanic Genius"
        );

        expect(hasSydriInCombo).toBeTruthy();
      });
    });

    it("can filter out specific cards", async () => {
      const { combos } = await spellbook.search("-card:Sydri -card:aetherflux");

      expect(combos.length).toBeGreaterThan(0);
      combos.forEach((combo) => {
        const hasSydriOrAetherfluxInCombo = combo.cards.find(
          (card) =>
            card.name === "Sydri, Galvanic Genius" ||
            card.name === "Aetherflux Reservoir"
        );

        expect(hasSydriOrAetherfluxInCombo).toBeFalsy();
      });
    });

    it("looks up number of cards", async () => {
      const { combos } = await spellbook.search("cards>5");

      expect(combos.length).toBeGreaterThan(0);
      combos.forEach((combo) => {
        expect(combo.cards.length > 5).toBe(true);
      });
    });

    it("can specify sort", async () => {
      const { combos } = await spellbook.search("ci:wubrg sort:cards");

      expect(combos.length).toBeGreaterThan(0);
      let numberOfCards = 2;

      combos.forEach((combo) => {
        if (combo.cards.length > numberOfCards) {
          numberOfCards = combo.cards.length;
          return;
        }
        expect(combo.cards.length).toBe(numberOfCards);
      });

      expect(numberOfCards).toBeGreaterThan(2);
      expect(numberOfCards).toBeLessThan(11);
    });

    describe("color identity", () => {
      it("looks up specific color combos", async () => {
        const { combos } = await spellbook.search("ci:wr");

        expect(combos.length).toBeGreaterThan(0);
        combos.forEach((combo) => {
          const hasOffColorCombo = combo.colorIdentity.colors.find(
            (color: string) => color !== "w" && color !== "r" && color !== "c"
          );

          expect(hasOffColorCombo).toBeFalsy();
        });
      });

      it("looks up exact color combos", async () => {
        const { combos } = await spellbook.search("ci=wr");

        expect(combos.length).toBeGreaterThan(0);
        combos.forEach((combo) => {
          expect(combo.colorIdentity.colors).toEqual(["r", "w"]);
        });
      });

      it("looks up colorless combos", async () => {
        const { combos } = await spellbook.search("ci:c");

        expect(combos.length).toBeGreaterThan(0);
        combos.forEach((combo) => {
          expect(combo.colorIdentity.colors).toEqual(["c"]);
        });
      });

      it("looks up greater than color combos", async () => {
        const { combos } = await spellbook.search("ci>wr");

        expect(combos.length).toBeGreaterThan(0);
        combos.forEach((combo) => {
          const { colors } = combo.colorIdentity;
          expect(colors.length).toBeGreaterThan(2);
          expect(colors).toContain("w");
          expect(colors).toContain("r");
        });
      });

      it("looks up greater than or equal color combos", async () => {
        const { combos } = await spellbook.search("ci>=wr");

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
        const { combos } = await spellbook.search("ci<wru");

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
        const { combos } = await spellbook.search("ci<=wru");

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

      it("looks up combos without a color identity", async () => {
        const { combos } = await spellbook.search("-ci=wru");

        expect(combos.length).toBeGreaterThan(0);
        combos.forEach((combo) => {
          const { colors } = combo.colorIdentity;
          const hasColorsFromQuery =
            colors.includes("w") &&
            colors.includes("r") &&
            colors.includes("u") &&
            colors.length === 3;
          expect(hasColorsFromQuery).toBe(false);
        });
      });
    });

    it("looks up specific prequisite in combos", async () => {
      const { combos } = await spellbook.search("prerequisites:permanents");

      expect(combos.length).toBeGreaterThan(0);
      const hasWordPermanentsInComboPreq = combos.every((combo) => {
        return combo.prerequisites.find(
          (prereq) => prereq.toLowerCase().indexOf("permanents") > -1
        );
      });

      expect(hasWordPermanentsInComboPreq).toBeTruthy();
    });

    it("looks up combos that exclude specific prerequisites in combos", async () => {
      const { combos } = await spellbook.search(
        "-prerequisites:permanents -prerequisite:tap -pre:mana"
      );

      expect(combos.length).toBeGreaterThan(0);
      const doesNotHaveWordPermanentsTapOrManaInPrerequisites = combos.every(
        (combo) => {
          return !combo.prerequisites.find(
            (res) =>
              res.toLowerCase().indexOf("permanents") > -1 ||
              res.toLowerCase().indexOf("tap") > -1 ||
              res.toLowerCase().indexOf("mana") > -1
          );
        }
      );

      expect(doesNotHaveWordPermanentsTapOrManaInPrerequisites).toBeTruthy();
    });

    it("looks up specific step in combos", async () => {
      const { combos } = await spellbook.search("steps:Tap");

      expect(combos.length).toBeGreaterThan(0);
      const hasWordTapInSteps = combos.every((combo) => {
        return combo.steps.find(
          (step) => step.toLowerCase().indexOf("tap") > -1
        );
      });

      expect(hasWordTapInSteps).toBeTruthy();
    });

    it("looks up combos that exclude specific steps in combos", async () => {
      const { combos } = await spellbook.search("-step:Tap -steps:Sacrifice");

      expect(combos.length).toBeGreaterThan(0);
      const doesNotHaveWordTapOrSacrificeInSteps = combos.every((combo) => {
        return !combo.steps.find(
          (res) =>
            res.toLowerCase().indexOf("tap") > -1 ||
            res.toLowerCase().indexOf("sacrifice") > -1
        );
      });

      expect(doesNotHaveWordTapOrSacrificeInSteps).toBeTruthy();
    });

    it("looks up specific result in combos", async () => {
      const { combos } = await spellbook.search("results:Infinite");

      expect(combos.length).toBeGreaterThan(0);
      const hasWordInfiniteInResult = combos.every((combo) => {
        return combo.results.find(
          (res) => res.toLowerCase().indexOf("infinite") > -1
        );
      });

      expect(hasWordInfiniteInResult).toBeTruthy();
    });

    it("looks up combos that exclude specific result in combos", async () => {
      const { combos } = await spellbook.search(
        "-results:Infinite -result:win"
      );

      expect(combos.length).toBeGreaterThan(0);
      const doesNotHaveWordInfiniteOrWinInResult = combos.every((combo) => {
        return !combo.results.find(
          (res) =>
            res.toLowerCase().indexOf("infinite") > -1 ||
            res.toLowerCase().indexOf("win") > -1
        );
      });

      expect(doesNotHaveWordInfiniteOrWinInResult).toBeTruthy();
    });

    it("searches for banned combos", async () => {
      const { combos } = await spellbook.search("is:banned");

      expect(combos.length).toBeGreaterThan(0);
      combos.forEach((combo) => {
        expect(combo.hasBannedCard).toBe(true);
      });
    });

    it("excludes banned combos by default", async () => {
      const allCombos = await spellbook.getAllCombos();
      const { combos: combosThatAreNotBanned } = await spellbook.search("");
      const { combos: combosThatIncludeBannedOnes } = await spellbook.search(
        "include:banned"
      );

      expect(combosThatIncludeBannedOnes.length).toBeGreaterThan(
        combosThatAreNotBanned.length
      );
      expect(combosThatIncludeBannedOnes.length).toBe(allCombos.length);
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

  describe("getAllCombos", () => {
    it("returns a all combos", async () => {
      const combos = await spellbook.getAllCombos();

      expect(combos.length).toBeGreaterThan(0);
      expect(combos[0].commanderSpellbookId).toBeTruthy();
      expect(combos[0].permalink).toBeTruthy();
      expect(combos[0].cards).toBeTruthy();
      expect(combos[0].colorIdentity).toBeTruthy();
      expect(combos[0].prerequisites).toBeTruthy();
      expect(combos[0].steps).toBeTruthy();
      expect(combos[0].results).toBeTruthy();
    });
  });

  describe("autocomplete", () => {
    it("returns all card names", async () => {
      const names = await spellbook.autocomplete("cards", "");

      expect(names.length).toBeGreaterThan(2500);
    });

    it("returns card names that match partially", async () => {
      const names = await spellbook.autocomplete("cards", "mind");

      expect(names.length).toBeLessThan(50);
      names.forEach((name) => {
        expect(name.value).toContain("mind");
      });
    });

    it("returns card names that match exactly (regardless of capitalization and puntuation)", async () => {
      const names = await spellbook.autocomplete(
        "cards",
        "sydri galvanic genius"
      );

      expect(names.length).toBe(1);
      expect(names[0].value).toBe("sydri galvanic genius");
      expect(names[0].label).toBe("Sydri, Galvanic Genius");
    });

    it("returns all results", async () => {
      const results = await spellbook.autocomplete("results", "");

      expect(results.length).toBeGreaterThan(700);
    });

    it("returns results that match partially", async () => {
      const results = await spellbook.autocomplete("results", "infinite");

      expect(results.length).toBeLessThan(700);
      results.forEach((result) => {
        expect(result.value.toLowerCase()).toContain("infinite");
      });
    });

    it("returns all colors", async () => {
      const colors = await spellbook.autocomplete("colors", "");

      // 32 + 5 entries for sans-color
      expect(colors.length).toBe(37);
    });

    it("returns colors that match partially", async () => {
      const colors = await spellbook.autocomplete("colors", "sans");

      expect(colors.length).toBe(5);
    });
  });
});
