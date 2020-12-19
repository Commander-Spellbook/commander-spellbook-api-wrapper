import scryfall from "scryfall-client";

type HTMLListOptions = {
  className?: string;
};

// based on https://blog.simontest.net/extend-array-with-typescript-965cc1134b3
export default class SpellbookList extends Array<string> {
  private rawString: string;

  private constructor(items: string[]) {
    super(...items);
    this.rawString = "";
  }

  static create(items?: string): SpellbookList {
    const list = Object.create(SpellbookList.prototype);

    if (items) {
      const entries = items.split(/\.\s?/).filter((entry) => entry);

      list.rawString = items;
      list.push(...entries);
    }

    return list;
  }

  private findItem(item: string) {
    return this.find((i) => i.toLowerCase().indexOf(item.toLowerCase()) > -1);
  }

  matchesAll(items: string[]): boolean {
    return items.every((item) => this.findItem(item));
  }

  matchesAny(items: string[]): boolean {
    return Boolean(items.find((item) => this.findItem(item)));
  }

  toString(): string {
    return this.rawString;
  }

  toHTMLOrderedList(options: HTMLListOptions = {}): HTMLOListElement {
    return this.toHTMLList("ol", options);
  }

  toHTMLUnorderedList(options: HTMLListOptions = {}): HTMLUListElement {
    return this.toHTMLList("ul", options);
  }

  toMarkdown(): string {
    return this.reduce((md, item) => {
      if (md) {
        md = `${md}\n`;
      }
      return `${md}- ${item}`;
    }, "");
  }

  private replaceManaEmoijiWithHTMLImageString(item: string): string {
    return item.replace(/:mana([^:]+):/g, (_, manaSymbol) => {
      const url = scryfall.getSymbolUrl(manaSymbol);
      return `<img src="${url}" />`;
    });
  }

  private toHTMLList(kind: "ul", options: HTMLListOptions): HTMLUListElement;
  private toHTMLList(kind: "ol", options: HTMLListOptions): HTMLOListElement;
  private toHTMLList(kind: string, options: HTMLListOptions = {}): HTMLElement {
    let root = `<${kind}`;

    if (options.className) {
      root += ` class="${options.className}"`;
    }
    root += ">";

    const items = this.map((item) => {
      return `<li>${this.replaceManaEmoijiWithHTMLImageString(item)}</li>`;
    }).join("");

    const htmlString = `${root}
  ${items}
</${kind}>`;
    const fragment = document.createDocumentFragment();
    const parser = new window.DOMParser();
    const parsed: Document = parser.parseFromString(htmlString, "text/html");
    const elements = parsed.getElementsByTagName("body")[0].children;

    Array.from(elements).forEach((e) => fragment.appendChild(e));

    return fragment.firstElementChild as HTMLElement;
  }
}
