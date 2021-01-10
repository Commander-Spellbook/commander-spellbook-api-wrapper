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
}
