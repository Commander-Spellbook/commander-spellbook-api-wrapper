import scryfall from "scryfall-client";
import normalizeStringInput from "../normalize-string-input";

type ToHTMLOptions = {
  skipName?: boolean;
  skipTooltip?: boolean;
  className?: string;
};

const CARD_BACK = "https://c2.scryfall.com/file/scryfall-errors/missing.jpg";
const CARD_IMAGE_NAMED_BASE_URL =
  "https://api.scryfall.com/cards/named?format=image&exact=";

let tooltip: HTMLDivElement;
let cardImg: HTMLImageElement;

export default class Card {
  name: string;
  private normalizedName: string;
  private cardImageURI: string;

  static HAS_TOOLTIP = false;
  static clearTooltipCache(): void {
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
    this.cardImageURI =
      CARD_IMAGE_NAMED_BASE_URL + encodeURIComponent(this.name);
  }

  matches(cardName: string): boolean {
    return this.normalizedName.indexOf(normalizeStringInput(cardName)) > -1;
  }

  getScryfallData(): ReturnType<typeof scryfall.getCard> {
    return scryfall.getCard(this.name, "exactName");
  }

  getScryfallImageUrl(version?: string): string {
    let src = this.cardImageURI;

    if (version) {
      src = `${src}&version=art_crop`;
    }

    return src;
  }

  toString(): string {
    return this.name;
  }

  toImage(version?: string): HTMLImageElement {
    const img = document.createElement("img");
    img.alt = this.name;
    img.src = this.getScryfallImageUrl(version);

    return img;
  }

  toHTML(options: ToHTMLOptions = {}): HTMLSpanElement {
    const span = document.createElement("span");

    if (!options.skipName) {
      span.innerText = this.name;
    }
    if (options.className) {
      span.className = options.className;
    }

    if (!options.skipTooltip) {
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

        if (cardImg.src !== this.cardImageURI) {
          cardImg.src = this.cardImageURI;
        }
      });

      span.addEventListener("mouseout", () => {
        if (Card.HAS_TOOLTIP) {
          tooltip.style.display = "none";
        }
      });
    }

    return span;
  }
}
