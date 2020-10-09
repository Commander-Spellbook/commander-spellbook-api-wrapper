import CardGrouping from "../../../src/models/card-grouping";
import Card from "../../../src/models/card";

describe("CardGrouping", () => {
  it("has array methods", () => {
    expect.assertions(7);

    const group = CardGrouping.create();

    group.push(new Card("Card a"), new Card("Card b"), new Card("Card c"));

    expect(group.length).toBe(3);
    expect(group[0].name).toBe("Card a");
    expect(group[1].name).toBe("Card b");
    expect(group[2].name).toBe("Card c");
    group.forEach((item, index) => {
      expect(item).toBe(group[index]);
    });
  });

  describe("create", () => {
    it("makes a new card group from the strings", () => {
      const group = CardGrouping.create(["Card a", "Card b", "Card c"]);

      expect(group.length).toBe(3);
      expect(group[0].name).toBe("Card a");
      expect(group[1].name).toBe("Card b");
      expect(group[2].name).toBe("Card c");
    });
  });

  describe("matches", () => {
    it("returns true when every card name passed matches a card in the array", () => {
      const group = CardGrouping.create(["Card a", "Card b", "Card c"]);

      expect(group.matches(["Card a", "Card b"])).toBe(true);
      expect(group.matches(["Card a", "Card z"])).toBe(false);
    });
  });

  describe("toString", () => {
    it("renders as the raw string passed in", () => {
      const group = CardGrouping.create(["Card a", "Card b", "Card c"]);

      expect(group.toString()).toBe("Card a | Card b | Card c");
      expect(`pre: ${group} - post`).toBe(
        "pre: Card a | Card b | Card c - post"
      );
    });
  });

  describe("toHTMLOrderedList", () => {
    it("returns an HTMLOListElement", () => {
      const group = CardGrouping.create(["Card a", "Card b", "Card c"]);
      const ol = group.toHTMLOrderedList();
      const lis = ol.querySelectorAll("li");

      expect(ol).toBeInstanceOf(HTMLOListElement);
      expect(lis.length).toBe(3);
      expect(lis[0].querySelector("span")?.innerText).toBe("Card a");
      expect(lis[1].querySelector("span")?.innerText).toBe("Card b");
      expect(lis[2].querySelector("span")?.innerText).toBe("Card c");
    });
  });

  describe("toHTMLUnorderedList", () => {
    it("returns an HTMLUListElement", () => {
      const group = CardGrouping.create(["Card a", "Card b", "Card c"]);
      const ul = group.toHTMLUnorderedList();
      const lis = ul.querySelectorAll("li");

      expect(ul).toBeInstanceOf(HTMLUListElement);
      expect(lis.length).toBe(3);
      expect(lis[0].querySelector("span")?.innerText).toBe("Card a");
      expect(lis[1].querySelector("span")?.innerText).toBe("Card b");
      expect(lis[2].querySelector("span")?.innerText).toBe("Card c");
    });
  });

  describe("toMarkdown", () => {
    it("returns a markdown list", () => {
      const group = CardGrouping.create(["Card a", "Card b", "Card c"]);
      const md = group.toMarkdown();

      expect(md).toBe(`- Card a
- Card b
- Card c`);
    });
  });
});
