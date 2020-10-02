## Commander Spellbook

An unofficial wrapper for the [Commander Spellbook](https://commanderspellbook.com/) API.

# Installation

```
npm install --save commander-spellbook
```

The module is a singleton object that can look up combos from the Commander Spellbook API.

```js
var spellbook = require("commander-spellbook");
```

# Why?

The API that Commander Spellbook provides is a JSON version of the underlying Google spreadsheet that they use to host the combo data. While convenient that the data is available to use, the actual method for looking up combos could be easier. This module aims to simplify the lookup process.

# Usage

The main method on the module is `search`, which takes a configuration object like:

```js
{
  cards: Array<"strings representing card names">;
  colors: string | Array<string>;
}
```

One or both properties must be used. The resulting object will be an array of combos that have this shape:

```js
{
  commanderSpellbookId: number;
  permalink: "https://commanderspellbook.com/?id=" + commanderSpellbookId;
  cards: Array<ScryfallCardObjects>;
  colorIdentity: Array<string>;
  prerequisites: Array<string>;
  steps: Array<string>;
  result: Array<string>;
}
```

- `commanderSpellbookId` is the id in the commander spellbook database.
- `permalink` is the link available to view the combo on the commander spellbook website.
- `cards` is an array of [Scryfall](https://scryfall.com/) [card objects](https://scryfall.com/docs/api/cards) provided by the [Scryfall Client module](https://www.npmjs.com/package/scryfall-client).
- `colorIdentity` is an array of single character strings indicating the color identity of the combo
- `prerequisites` is an array of strings listing the things required before doing the combo.
- `steps` is an array of strings listing the steps to do the combo.
- `result` is an array of strings listing the results from doing the combo.

## Search Options

### cards

Pass an array of card names (up to 10) to look for combos for those cards.

When passing a `cards` array, at least one value must be passed.

```js
// find combos that include one card
spellbook
  .search({
    cards: ["Sydri, Galvanic Genius"],
  })
  .then(function (combos) {
    // loop through combos
  });

// find combos that include more than 1 card
spellbook
  .search({
    cards: ["Thornbite Staff", "Basilisk Collar"],
  })
  .then(function (combos) {
    // loop through combos
  });
```

Exact matches will be looked for first, but if no cards are found with those names, a fuzzy match will be tried instead.

```js
// find combos that include Sydri using a short name
spellbook
  .search({
    cards: ["Sydri"],
  })
  .then(function (combos) {
    // loop through combos
  });

// find combos that include Thornbite Staff and Basilisk Collar using a short name
spellbook
  .search({
    cards: ["Thorn Staff", "Bas Colla"],
  })
  .then(function (combos) {
    // loop through combos
  });
```

### colors

Pass either a string representing the color combination you're looking for:

```js
spellbook
  .search({
    colors: "bug",
  })
  .then(function (combos) {
    // loop through all combos in the sultai colors
  });
```

Or an array of single digit strings representing the color combination:

```js
spellbook
  .search({
    colors: ["b", "u", "g"],
  })
  .then(function (combos) {
    // loop through all combos in the sultai colors
  });
```

This is of course best used in conjunction with the `cards` option.

# Browser Support

The source code is written in Typescript and transpiled to ES5.

The module makes use of the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) object, so if this SDK is used in a browser that does not support promises, it will need to be polyfilled in your script.

# Contributing Guidelines

## Code Style

The code base uses [Prettier](https://prettier.io/). Run:

```sh
npm run pretty
```

## Testing

To lint and run all the tests, simply run:

```sh
npm test
```

To run just the unit tests, run:

```sh
npm run test:unit
```

To run just the linting command, run:

```sh
npm run lint
```

To run the integration tests, run:

```sh
npm run test:integration
```

To run the publishing test, run:

```sh
npm run test:publishing
```

## Bugs

If you find a bug, feel free to [open an issue](https://github.com/crookedneighbor/commander-spellbook/issues/new) or [a Pull Request](https://github.com/crookedneighbor/commander-spellbook/compare).
