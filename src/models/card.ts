import scryfall from "scryfall-client";
import normalizeStringInput from "../normalize-string-input";

const CARD_BACK = "https://c2.scryfall.com/file/scryfall-errors/missing.jpg";

let tooltip: HTMLDivElement;
let cardImg: HTMLImageElement;

export default class Card {
  name: string;
  private normalizedName: string;

  static IMAGE_CACHE: Record<string, Promise<string>> = {};
  static HAS_TOOLTIP = false;
  static clearImageCache(): void {
    Card.IMAGE_CACHE = {};
    Card.HAS_TOOLTIP = false;

    if (tooltip) {
      tooltip.style.display == "none";
    }
  }
  static generateTooltip(): HTMLDivElement {
    const tooltip = document.createElement("div");
    tooltip.classList.add("commander-spellbook-tooltip");
    tooltip.style.display = "none";
    tooltip.style.pointerEvents = "none";
    tooltip.style.position = "fixed";
    tooltip.style.zIndex = "9000000";
    tooltip.style.borderRadius = "4.75% / 3.5%";
    tooltip.style.height = "340px";
    tooltip.style.width = "244px";
    tooltip.style.overflow = "hidden";

    return tooltip;
  }

  constructor(cardName: string) {
    this.name = cardName;
    this.normalizedName = normalizeStringInput(cardName);
  }

  matches(cardName: string): boolean {
    return this.normalizedName.indexOf(normalizeStringInput(cardName)) > -1;
  }

  getScryfallData(): ReturnType<typeof scryfall.getCard> {
    return scryfall.getCard(this.name, "exactName");
  }

  toString(): string {
    return this.name;
  }

  toHTML(): HTMLSpanElement {
    const span = document.createElement("span");

    span.innerText = this.name;

    span.addEventListener("mousemove", (event) => {
      if (window.innerWidth < 768) {
        // window is too small to bother with presenting card image
        return;
      }

      if (!Card.HAS_TOOLTIP) {
        Card.HAS_TOOLTIP = true;
        tooltip = Card.generateTooltip();

        cardImg = document.createElement("img");
        cardImg.src = CARD_BACK;
        tooltip.appendChild(cardImg);

        document.body.appendChild(tooltip);
      }

      if (tooltip.style.display !== "block") {
        tooltip.style.display = "block";
      }

      tooltip.style.left = event.clientX + 50 + "px";
      tooltip.style.top = event.clientY - 30 + "px";

      if (!Card.IMAGE_CACHE[this.name]) {
        cardImg.src = CARD_BACK;
        Card.IMAGE_CACHE[this.name] = this.getScryfallData().then((data) => {
          return data.getImage();
        });
      }

      Card.IMAGE_CACHE[this.name].then((image) => {
        if (cardImg.src !== image) {
          cardImg.src = image;
        }
      });
    });

    span.addEventListener("mouseout", () => {
      if (Card.HAS_TOOLTIP) {
        tooltip.style.display = "none";
      }
    });

    return span;
  }
}
