/* eslint-disable @typescript-eslint/no-non-null-assertion */
import scryfall from "scryfall-client";
import Card from "../../../src/models/card";

import { mocked } from "ts-jest/utils";

type FakeEvent = {
  clientX: number;
  clientY: number;
};

describe("Card", () => {
  afterEach(() => {
    Card.clearTooltipCache();
  });

  it("has a name attribute", () => {
    const card = new Card("Sydri, Galvanic Genius");

    expect(card.name).toEqual("Sydri, Galvanic Genius");
  });

  describe("matches", () => {
    it("returns true when the input is the name", () => {
      const card = new Card("Sydri, Galvanic Genius");

      expect(card.matches("Sydri, Galvanic Genius")).toBe(true);
      expect(card.matches("Arjun, the Shifting Flame")).toBe(false);
    });

    it("returns true for partial matches", () => {
      const card = new Card("Sydri, Galvanic Genius");

      expect(card.matches("Sydri")).toBe(true);
      expect(card.matches("alv")).toBe(true);
      expect(card.matches("nius")).toBe(true);
    });

    it("disregards punctuation and casing", () => {
      const card = new Card("Sydri, Galvanic Genius");

      expect(card.matches("sYd~Ri G!alva??nIc GENIUS")).toBe(true);
    });
  });

  describe("toString", () => {
    it("returns the raw name", () => {
      const card = new Card("Sydri, Galvanic Genius");

      expect(card.toString()).toEqual("Sydri, Galvanic Genius");
      expect(`text ${card} text`).toEqual("text Sydri, Galvanic Genius text");
    });
  });

  describe("getScryfallData", () => {
    it("calls out to scryfall.getCard", async () => {
      const payload = {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(scryfall, "getCard").mockResolvedValue(payload as any);

      const card = new Card("Sydri, Galvanic Genius");

      const scryfallResult = await card.getScryfallData();

      expect(scryfallResult).toBe(payload);
      expect(scryfall.getCard).toBeCalledTimes(1);
      expect(scryfall.getCard).toBeCalledWith(
        "Sydri, Galvanic Genius",
        "exactName"
      );
    });
  });

  describe("toString", () => {
    it("returns the raw name", () => {
      const card = new Card("Sydri, Galvanic Genius");

      expect(card.toString()).toEqual("Sydri, Galvanic Genius");
      expect(`text ${card} text`).toEqual("text Sydri, Galvanic Genius text");
    });
  });

  describe("toImage", () => {
    it("returns an img element", () => {
      const card = new Card("Sydri, Galvanic Genius");

      const img = card.toImage();

      expect(img).toBeInstanceOf(HTMLImageElement);
      expect(img.src).toBe(
        "https://api.scryfall.com/cards/named?format=image&exact=Sydri%2C%20Galvanic%20Genius"
      );
    });

    it("can specifiy a version", () => {
      const card = new Card("Sydri, Galvanic Genius");

      const img = card.toImage("art_crop");

      expect(img).toBeInstanceOf(HTMLImageElement);
      expect(img.src).toBe(
        "https://api.scryfall.com/cards/named?format=image&exact=Sydri%2C%20Galvanic%20Genius&version=art_crop"
      );
    });
  });

  describe("toHTML", () => {
    it("returns a span element", () => {
      const card = new Card("Sydri, Galvanic Genius");

      const span = card.toHTML();

      expect(span).toBeInstanceOf(HTMLSpanElement);
      expect(span.innerText).toBe("Sydri, Galvanic Genius");
    });

    it("can opt out of name", () => {
      const card = new Card("Sydri, Galvanic Genius");

      const span = card.toHTML({
        skipName: true,
      });

      expect(span).toBeInstanceOf(HTMLSpanElement);
      expect(span.innerText).toBeFalsy();
    });

    it("can add a class name", () => {
      const card = new Card("Sydri, Galvanic Genius");

      const span = card.toHTML({
        className: "some custom classes",
      });

      expect(span).toBeInstanceOf(HTMLSpanElement);
      expect(span.className).toBe("some custom classes");
    });

    it("creates mouse event listeners for tooltip", () => {
      const card = new Card("Sydri, Galvanic Genius");

      jest.spyOn(HTMLSpanElement.prototype, "addEventListener");

      const span = card.toHTML();

      expect(span.addEventListener).toBeCalledTimes(2);
      expect(span.addEventListener).toBeCalledWith(
        "mousemove",
        expect.any(Function)
      );
      expect(span.addEventListener).toBeCalledWith(
        "mouseout",
        expect.any(Function)
      );
    });

    it("sets tooltip styles when mousemove event is triggered", async () => {
      const tooltip = document.createElement("div");
      tooltip.style.display = "none";
      const card = new Card("Sydri, Galvanic Genius");

      jest.spyOn(HTMLSpanElement.prototype, "addEventListener");

      const span = card.toHTML();
      const mousemoveHandler = (mocked(span.addEventListener).mock.calls.find(
        (call) => {
          return call[0] === "mousemove";
        }
      )![1] as unknown) as (event: FakeEvent) => void;

      jest.spyOn(Card, "generateTooltip").mockReturnValue(tooltip);

      mousemoveHandler({
        clientX: 54,
        clientY: 1002,
      });

      expect(tooltip.style.display).toBe("block");
      expect(tooltip.style.left).toBe("104px");
      expect(tooltip.style.top).toBe("972px");
    });

    it("creates tooltip with scryfall image", async () => {
      const tooltip = document.createElement("div");
      tooltip.style.display = "none";
      const card = new Card("Sydri, Galvanic Genius");

      jest.spyOn(HTMLSpanElement.prototype, "addEventListener");

      const span = card.toHTML();
      const mousemoveHandler = (mocked(span.addEventListener).mock.calls.find(
        (call) => {
          return call[0] === "mousemove";
        }
      )![1] as unknown) as (event: FakeEvent) => void;

      jest.spyOn(Card, "generateTooltip").mockReturnValue(tooltip);

      mousemoveHandler({
        clientX: 54,
        clientY: 1002,
      });

      expect(tooltip.querySelector("img")!.src).toBe(
        "https://api.scryfall.com/cards/named?format=image&exact=Sydri%2C%20Galvanic%20Genius"
      );
    });

    it("can opt out of tooltip", () => {
      const card = new Card("Sydri, Galvanic Genius");

      jest.spyOn(HTMLSpanElement.prototype, "addEventListener");

      const span = card.toHTML({
        skipTooltip: true,
      });

      expect(span.addEventListener).toBeCalledTimes(0);
    });
  });
});
