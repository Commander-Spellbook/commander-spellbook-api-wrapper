import normalizeStringInput from "../normalize-string-input";

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
      const entries = items.split(/\.\s?/).filter((entry) => entry.trim());

      list.rawString = items;
      list.push(...entries);
    }

    return list;
  }

  size(): number {
    return this.length;
  }

  includesValue(value: string): boolean {
    value = normalizeStringInput(value);

    const foundItem = this.map(normalizeStringInput).find(
      (item) => item.indexOf(value) > -1
    );
    return Boolean(foundItem);
  }

  includesValueExactly(value: string): boolean {
    value = normalizeStringInput(value);

    const foundItem = this.map(normalizeStringInput).find(
      (item) => item === value
    );

    return Boolean(foundItem);
  }

  toString(): string {
    return this.rawString;
  }
}
