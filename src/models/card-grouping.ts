import Card from "./card";

// based on https://blog.simontest.net/extend-array-with-typescript-965cc1134b3
export default class CardGrouping extends Array<Card> {
  private constructor(items: Card[]) {
    super(...items);
  }

  static create(items?: string[]): CardGrouping {
    const list = Object.create(CardGrouping.prototype);

    if (items) {
      const cards = items.map((item) => new Card(item));
      list.push(...cards);
    }

    return list;
  }

  matches(cardNames: string[]): boolean {
    return cardNames.every((card) => this.find((c) => c.matches(card)));
  }

  toString(): string {
    return this.join(" | ");
  }

  toHTMLOrderedList(): HTMLOListElement {
    return this.toHTMLList("ol");
  }

  toHTMLUnorderedList(): HTMLUListElement {
    return this.toHTMLList("ul");
  }

  toMarkdown(): string {
    return this.reduce((md, item) => {
      if (md) {
        md = `${md}\n`;
      }
      return `${md}- ${item.name}`;
    }, "");
  }

  private toHTMLList(kind: "ul"): HTMLUListElement;
  private toHTMLList(kind: "ol"): HTMLOListElement;
  private toHTMLList(kind: string): HTMLElement {
    const lis = this.map((item) => {
      const li = document.createElement("li");
      li.appendChild(item.toHTML());

      return li;
    });
    const container = document.createElement(kind);
    lis.forEach((li) => container.appendChild(li));

    return container;
  }
}
