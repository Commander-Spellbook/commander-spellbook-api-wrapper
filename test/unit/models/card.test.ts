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
    Card.clearImageCache();
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

  describe("toHTML", () => {
    beforeEach(() => {
      const scryfallPayload = {
        getImage: jest.fn().mockReturnValue("https://example.com/card.png"),
      };

      jest
        .spyOn(Card.prototype, "getScryfallData")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockResolvedValue(scryfallPayload as any);
    });

    it("returns a span element", () => {
      const card = new Card("Sydri, Galvanic Genius");

      const span = card.toHTML();

      expect(span).toBeInstanceOf(HTMLSpanElement);
      expect(span.innerText).toBe("Sydri, Galvanic Genius");
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

    it("looks up Scryfall image", async () => {
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
        "https://c2.scryfall.com/file/scryfall-errors/missing.jpg"
      );

      expect(card.getScryfallData).toBeCalledTimes(1);

      // wait for img to be found and set
      await Promise.resolve();
      await Promise.resolve();

      expect(tooltip.querySelector("img")!.src).toBe(
        "https://example.com/card.png"
      );
    });

    it("looks up Scryfall image exactly once for the same card name", async () => {
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
      mousemoveHandler({
        clientX: 4,
        clientY: 102,
      });
      mousemoveHandler({
        clientX: 24,
        clientY: 10,
      });
      mousemoveHandler({
        clientX: 74,
        clientY: 202,
      });

      // wait for img to be found and set
      await Promise.resolve();
      await Promise.resolve();

      expect(card.getScryfallData).toBeCalledTimes(1);
    });

    it("looks up Scryfall image exactly once for the same card name across different Card instances", async () => {
      const tooltip = document.createElement("div");
      tooltip.style.display = "none";
      const card = new Card("Sydri, Galvanic Genius");
      const card2 = new Card("Sydri, Galvanic Genius");

      jest.spyOn(HTMLSpanElement.prototype, "addEventListener");

      card.toHTML();
      card2.toHTML();

      const mousemoveHandlers = (mocked(
        HTMLSpanElement.prototype.addEventListener
      )
        .mock.calls.filter((call) => {
          return call[0] === "mousemove";
        })
        .map((call) => {
          return call[1];
        }) as unknown) as Array<(event: FakeEvent) => void>;

      jest.spyOn(Card, "generateTooltip").mockReturnValue(tooltip);

      mousemoveHandlers[0]({
        clientX: 54,
        clientY: 1002,
      });
      mousemoveHandlers[1]({
        clientX: 4,
        clientY: 102,
      });

      // wait for img to be found and set
      await Promise.resolve();
      await Promise.resolve();

      expect(card.getScryfallData).toBeCalledTimes(1);
    });
  });
});
