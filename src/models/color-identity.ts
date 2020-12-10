import scryfall from "scryfall-client";
import type { ColorIdentityColors } from "../types";

const WUBRG_ORDER: ColorIdentityColors[] = ["w", "u", "b", "r", "g"];

export default class ColorIdentity {
  private rawString: string;
  colors: ColorIdentityColors[];

  constructor(colors: string) {
    this.rawString = colors;
    this.colors = WUBRG_ORDER.filter((color) => {
      return colors.indexOf(color) > -1;
    });

    if (this.colors.length === 0) {
      this.colors.push("c");
    }
  }

  private isColorless(): boolean {
    return this.colors.length === 1 && this.colors[0] === "c";
  }

  hasColors(colors: ColorIdentityColors[]): boolean {
    if (this.isColorless()) {
      return true;
    }

    const allColors = this.colors.concat(colors);
    const colorSet = new Set(allColors);

    return colorSet.size === colors.length;
  }

  toString(): string {
    return this.rawString;
  }

  toMarkdown(): string {
    return this.colors.map((color) => `:mana${color}:`).join("");
  }

  toHTML(): DocumentFragment {
    const fragment = document.createDocumentFragment();

    this.colors.forEach((color) => {
      const img = document.createElement("img");
      img.src = scryfall.getSymbolUrl(color);

      fragment.appendChild(img);
    });

    return fragment;
  }
}
