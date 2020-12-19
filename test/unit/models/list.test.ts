import SpellbookList from "../../../src/models/list";

describe("SpellbookList", () => {
  it("has array methods", () => {
    expect.assertions(7);

    const list = SpellbookList.create();

    list.push("a", "b", "c");

    expect(list.length).toBe(3);
    expect(list[0]).toBe("a");
    expect(list[1]).toBe("b");
    expect(list[2]).toBe("c");
    list.forEach((item, index) => {
      expect(item).toBe(list[index]);
    });
  });

  describe("create", () => {
    it("makes a new list from the string, splitting on .", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");

      expect(list.length).toBe(3);
      expect(list[0]).toBe("Step 1");
      expect(list[1]).toBe("Step 2");
      expect(list[2]).toBe("Step 3");
    });
  });

  describe("matchesAll", () => {
    it("returns true if every item matches", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");

      expect(list.matchesAll(["step", "2", "3"])).toBe(true);
    });

    it("returns false if any item does not match", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");

      expect(list.matchesAll(["step", "foo", "2", "3"])).toBe(false);
    });
  });

  describe("matchesAny", () => {
    it("returns true if any item matches", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");

      expect(list.matchesAny(["foo", "step", "bar"])).toBe(true);
    });

    it("returns false if no item matches", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");

      expect(list.matchesAny(["foo", "bar"])).toBe(false);
    });
  });

  describe("toString", () => {
    it("renders as the raw string passed in", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");

      expect(list.toString()).toBe("Step 1. Step 2. Step 3.");
      expect(`pre: ${list} - post`).toBe("pre: Step 1. Step 2. Step 3. - post");
    });
  });

  describe("toHTMLOrderedList", () => {
    it("returns an HTMLOListElement", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");
      const ol = list.toHTMLOrderedList();
      const lis = ol.querySelectorAll("li");

      expect(ol).toBeInstanceOf(HTMLOListElement);
      expect(lis.length).toBe(3);
      expect(lis[0].innerHTML).toBe("Step 1");
      expect(lis[1].innerHTML).toBe("Step 2");
      expect(lis[2].innerHTML).toBe("Step 3");
    });

    it("transforms mana-emoji syntax to an img", () => {
      const list = SpellbookList.create(
        "Step :manaw::manau: 1. Step 2 :manar:. :manag:Step 3."
      );
      const ol = list.toHTMLOrderedList();
      const lis = ol.querySelectorAll("li");

      expect(lis.length).toBe(3);
      expect(lis[0].innerHTML).toEqual(
        expect.stringMatching(/Step <img src=".*W.svg"><img src=.*U.svg"> 1/)
      );
      expect(lis[1].innerHTML).toEqual(
        expect.stringMatching(/^Step 2 <img src=".*R.svg">$/)
      );
      expect(lis[2].innerHTML).toEqual(
        expect.stringMatching(/<img src=".*G.svg">Step 3/)
      );
    });

    it("can pass a className", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");
      const ol = list.toHTMLOrderedList({
        className: "custom class name",
      });

      expect(ol.className).toBe("custom class name");
    });
  });

  describe("toHTMLUnorderedList", () => {
    it("returns an HTMLUListElement", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");
      const ul = list.toHTMLUnorderedList();
      const lis = ul.querySelectorAll("li");

      expect(ul).toBeInstanceOf(HTMLUListElement);
      expect(lis.length).toBe(3);
      expect(lis[0].innerHTML).toBe("Step 1");
      expect(lis[1].innerHTML).toBe("Step 2");
      expect(lis[2].innerHTML).toBe("Step 3");
    });

    it("transforms mana-emoji syntax to an img", () => {
      const list = SpellbookList.create(
        "Step :manaw::manau: 1. Step 2 :manar:. :manag:Step 3."
      );
      const ul = list.toHTMLUnorderedList();
      const lis = ul.querySelectorAll("li");

      expect(lis.length).toBe(3);
      expect(lis[0].innerHTML).toEqual(
        expect.stringMatching(/Step <img src=".*W.svg"><img src=.*U.svg"> 1/)
      );
      expect(lis[1].innerHTML).toEqual(
        expect.stringMatching(/^Step 2 <img src=".*R.svg">$/)
      );
      expect(lis[2].innerHTML).toEqual(
        expect.stringMatching(/<img src=".*G.svg">Step 3/)
      );
    });

    it("can pass a className", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");
      const ul = list.toHTMLUnorderedList({
        className: "custom class name",
      });

      expect(ul.className).toBe("custom class name");
    });
  });

  describe("toMarkdown", () => {
    it("returns a markdown list", () => {
      const list = SpellbookList.create("Step 1. Step 2. Step 3.");
      const md = list.toMarkdown();

      expect(md).toBe(`- Step 1
- Step 2
- Step 3`);
    });

    it("leaves mana symbols in emoji-syntax", () => {
      const list = SpellbookList.create("Step 1. Step 2 :manar:. Step 3.");
      const md = list.toMarkdown();

      expect(md).toBe(`- Step 1
- Step 2 :manar:
- Step 3`);
    });
  });
});
