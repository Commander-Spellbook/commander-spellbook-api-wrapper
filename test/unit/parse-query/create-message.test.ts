import createMessage, {
  DATA_TYPES,
} from "../../../src/parse-query/create-message";
import makeFakeCombo from "../../../src/make-fake-combo";
import { makeSearchParams } from "../helper";

import type {
  SearchParameters,
  FormattedApiResponse,
} from "../../../src/types";

describe("createMessage", () => {
  let combos: FormattedApiResponse[];
  let searchParams: SearchParameters;

  beforeEach(() => {
    combos = [makeFakeCombo()];
    searchParams = makeSearchParams();
  });

  it("adds number combos to font of message", () => {
    expect(createMessage(combos, searchParams)).toMatch(/^1 combo where/);

    combos.push(makeFakeCombo(), makeFakeCombo(), makeFakeCombo());

    expect(createMessage(combos, searchParams)).toMatch(/^4 combos where/);
  });

  describe.each(DATA_TYPES)("%s", (dataType) => {
    it(`creates a message for number of ${dataType}`, () => {
      searchParams[dataType].sizeFilters.push(
        {
          method: ">",
          value: 5,
        },
        {
          method: "=",
          value: 4,
        },
        {
          method: "<=",
          value: 2,
        }
      );

      const message = createMessage(combos, searchParams);

      expect(message).toContain(
        `the number of ${dataType} is greater than 5 and the number of ${dataType} equals 4 and the number of ${dataType} is less than or equal to 2`
      );
    });

    it(`creates a message for data included in ${dataType}`, () => {
      searchParams[dataType].includeFilters.push(
        {
          method: ":",
          value: "data 1",
        },
        {
          method: "=",
          value: "data 2",
        },
        {
          method: ":",
          value: 'data with "quotes"',
        }
      );

      const message = createMessage(combos, searchParams);

      expect(message).toContain(
        `${dataType} have a value containing "data 1" and ${dataType} have a value of exactly "data 2" and ${dataType} have a value containing "data with \\"quotes\\""`
      );
    });

    it(`creates a message for data excluded from ${dataType}`, () => {
      searchParams[dataType].excludeFilters.push(
        {
          method: ":",
          value: "data 1",
        },
        {
          method: "=",
          value: "data 2",
        },
        {
          method: ":",
          value: 'data with "quotes"',
        }
      );

      const message = createMessage(combos, searchParams);

      expect(message).toContain(
        `${dataType} do not have a value containing "data 1" and ${dataType} do not have a value of exactly "data 2" and ${dataType} do not have a value containing "data with \\"quotes\\""`
      );
    });
  });

  describe("color identity", () => {
    it("creates a message for number of colors", () => {
      searchParams.colorIdentity.sizeFilters.push(
        {
          method: ">",
          value: 5,
        },
        {
          method: "=",
          value: 4,
        },
        {
          method: "<=",
          value: 2,
        }
      );

      const message = createMessage(combos, searchParams);

      expect(message).toContain(
        `the number of colors is greater than 5 and the number of colors equals 4 and the number of colors is less than or equal to 2`
      );
    });

    it("creates a message for data included in color identity", () => {
      searchParams.colorIdentity.includeFilters.push(
        {
          method: ":",
          value: ["w", "b"],
        },
        {
          method: "=",
          value: ["r", "b", "w"],
        },
        {
          method: ">",
          value: ["r", "b"],
        }
      );

      const message = createMessage(combos, searchParams);

      expect(message).toContain(
        `colors that are within "wb" and colors that are exactly "rbw" and colors that are greater than "rb"`
      );
    });

    it("creates a message for data excluded from colors", () => {
      searchParams.colorIdentity.excludeFilters.push(
        {
          method: ":",
          value: ["w", "b"],
        },
        {
          method: "=",
          value: ["r", "b", "w"],
        },
        {
          method: ">",
          value: ["r", "b"],
        }
      );

      const message = createMessage(combos, searchParams);

      expect(message).toContain(
        `colors that are not within "wb" and colors that are not exactly "rbw" and colors that are not greater than "rb"`
      );
    });
  });

  describe("tags", () => {
    it("creates a message for searches that include banned cards", () => {
      searchParams.tags.banned = "include";

      const message = createMessage(combos, searchParams);

      expect(message).toContain("including combos with banned cards");
    });

    it("creates a message for searches that exclude banned cards", () => {
      searchParams.tags.banned = "exclude";

      const message = createMessage(combos, searchParams);

      expect(message).toContain("excluding combos with banned cards");
    });

    it("creates a message for searches that have a banned card", () => {
      searchParams.tags.banned = "is";

      const message = createMessage(combos, searchParams);

      expect(message).toContain("at least one card is banned in commander");
    });

    it("creates a message for searches that have a no banned cards", () => {
      searchParams.tags.banned = "not";

      const message = createMessage(combos, searchParams);

      expect(message).toContain("no cards are banned in commaander");
    });

    it("creates a message for searches that include spoiled cards", () => {
      searchParams.tags.spoiled = "include";

      const message = createMessage(combos, searchParams);

      expect(message).toContain(
        "including combos with cards that are not yet released"
      );
    });

    it("creates a message for searches that exclude spoiled cards", () => {
      searchParams.tags.spoiled = "exclude";

      const message = createMessage(combos, searchParams);

      expect(message).toContain(
        "excluding combos with cards that are not yet released"
      );
    });

    it("creates a message for searches that have a spoiled card", () => {
      searchParams.tags.spoiled = "is";

      const message = createMessage(combos, searchParams);

      expect(message).toContain("at least one card is not yet released");
    });

    it("creates a message for searches that have a no spoiled cards", () => {
      searchParams.tags.spoiled = "not";

      const message = createMessage(combos, searchParams);

      expect(message).toContain("all cards have been released");
    });
  });
});
