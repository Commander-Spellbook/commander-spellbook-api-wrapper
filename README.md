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

Look up all the combos with the `search` method:

```js
spellbook.seach().then((combos) => {
  // loop over the array of combos
});
```

In addition, `search` takes an optional query string to filter the results.

```js
spellbook.seach("sydri scepter").then((combos) => {
  // all combos that include cards with the name sydri and scepter in them
});
```

Full or partial card names can also be used.

```js
spellbook.seach("card:'Arjun, the Shifting Flame' card:\"Thought Reflection\"").then((combos) => {
  // all combos that include cards with the name Arjun, the Shifting Flrame and Thought Reflection
});
```

You can also query by color identity using `ci` or `coloridentity`.

```js
spellbook.seach("Kiki ci:wbr").then((combos) => {
  // all combos that include cards with the name Kiki and have a white/black/red color identity
});
```

You can also query by the prequisites, steps and results in the combo.

```js
spellbook.seach("prequisites:'all permanents' steps:'Untap all' results:'infinite' results:'mana'").then((combos) => {
  // all combos that include the prerequisites, steps and results
});
```

The resulting object will be an array of combos that have this shape:

```js
{
  commanderSpellbookId: number;
  permalink: "https://commanderspellbook.com/?id=" + commanderSpellbookId;
  cards: Card[];
  colorIdentity: ColorIdentity;
  prerequisites: SpellbookList;
  steps: SpellbookList;
  results: SpellbookList;
}
```

- `commanderSpellbookId` is the id in the commander spellbook database as a string.
- `permalink` is the link available to view the combo on the commander spellbook website.
- `cards` is an array of [Card](#card) objects.
- `colorIdentity` is a [ColorIdentity](#coloridentity) object indicating the color identity of the combo
- `prerequisites` is a [SpellbookList](#spellbooklist) object that contains the things required before doing the combo.
- `steps` is a [SpellbookList](#spellbooklist) object that contains steps to do the combo.
- `result` is a [SpellbookList](#spellbooklist) object that contains the results from doing the combo.

See the [Models](#models) section for more information on the custom classes.

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

Partial matches also work:

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

Punctuation, capitalization and spaces are ignored:

```js
// find combos that include Alhammarret's Archive
spellbook
  .search({
    cards: ["mMaRrEts aR"],
  })
  .then(function (combos) {
    // loop through combos
  });
```

### colorIdentity

Pass either a string representing the color combination you're looking for:

```js
spellbook
  .search({
    colorIdentity: "bug",
  })
  .then(function (combos) {
    // loop through all combos in the sultai colors
  });
```

Or an array of single digit strings representing the color combination:

```js
spellbook
  .search({
    colorIdentity: ["b", "u", "g"],
  })
  .then(function (combos) {
    // loop through all combos in the sultai colors
  });
```

This is of course best used in conjunction with the `cards` option.

## Models

### Card

An object that has a few convenience methods for rendering the card.

The name of the card can accessed via the `name` property. The Scryfall URI can be accessed via the `scryfallURI` property;

```js
card.name; // "Rashmi, Eternities Crafter"
card.scryfallURI; // "https://scryfall.com/search?q=!%22Rasmi,+Eternities+Crafter%22"
```

#### getScryfallData

Resolves a promise with the [Scryfall object from the `scryfall-client` module](https://github.com/crookedneighbor/scryfall-client#card) for the card.

```js
card.getScryfallData().then((cardData) => {
  // inspect card data
});
```

#### getScryfallImageUrl

Returns a url that can be used to display the card using an image from Scryfall.

```js
const url = card.getScryfallImageUrl(); // https://api.scryfall.com/cards/named?format=image&exact=Rashmi,%2C%20Eternities%20Crafter
```

A string may be passed as an argument to specify what kind of image you would like. See the [Scryfyall `version` documentation](https://scryfall.com/docs/api/cards/named) for more details. The possible values are:

- small
- normal
- large
- png
- art_crop
- border_crop

```js
const url = card.getScryfallImageUrl("art_crop"); // https://api.scryfall.com/cards/named?format=image&exact=Rashmi,%2C%20Eternities%20Crafter&version=art_crop
```

#### toString

Returns the raw result from the Commander Spellbook API.

```js
card.toString(); // Rashmi, Eternities Crafter
```

### toImage

Returns a `img` tag of the card.

```js
card.toImage(); // <img src="https://api.scryfall.com/cards/named?format=image&exact=Rashmi,%2C%20Eternities%20Crafter" />
```

A string may be passed as an argument to specify what kind of image you would like. See the [Scryfyall `version` documentation](https://scryfall.com/docs/api/cards/named) for more details. The possible values are:

- small
- normal
- large
- png
- art_crop
- border_crop

```js
card.toImage("art_crop"); // <img src="https://api.scryfall.com/cards/named?format=image&exact=Rashmi,%2C%20Eternities%20Crafter&version=art_crop" />
```

### toHTML

Returns a `span` tag of the card name that displays the card image when hovered over.

```js
card.toHTML(); // <span>Rashmi, Eternities Crafter</span>
```

It takes an options object:

```
{
  skipName?: boolean;
  skipTooltip?: boolean;
  className?: string;
}
```

`skipName` will not include the name of the card in the span, but will still attach the listeners for display the card image tooltip.

`skipTooltip` will skip adding code to generate the tooltip when hovering over the card name.

`className` will add any classes as the `className` attribute on the `span`.

### ColorIdentity

An object that has a few convenience methods for rendering the color identity.

The raw spellbook API gives the color identity in the form of a string. For a white/blue identity, the string would look like: "w,u".

The colors can be accessed with the `colors` array.

```js
ci.colors; // ["w", "u"]
```

#### toString

Returns the raw result from the Commander Spellbook API.

```js
ci.toString(); // w,u
```

### toMarkdown

Returns a string that renders teh color identity as markdown.

```js
ci.toMarkdown(); // :manaw::manau:
```

### toHTML

Returns a document fragment that includes the colors as mana symbols in img tags.

```js
ci.toHTML(); // <img src="https://c2.scryfall.com/file/scryfall-symbols/card-symbols/W.svg"><img src="https://c2.scryfall.com/file/scryfall-symbols/card-symbols/U.svg">
```

### SpellbookList

An Array-like object that has a few convenience methods for rendering the data.

The raw spellbook API gives the prerquisites, steps and results data in the form of a single string deliminated by `.`.

For the following examples, we'll assume that the raw Spellbook API gave us this information:

```
Step 1. Step 2. Step 3.
```

The `SpellbookList` model has various methods to access the data:

#### Array Methods

You can use any Array methods to access the data:

```js
list.length; // 3
list[0]; // Step 1
list[1]; // Step 2
list[2]; // Step 3
list.forEach((step) => {
  // render step
});
```

#### toString

Provides the raw string given to us by the Spellbook API.

```js
list.toString();
// Step 1. Step 2. Step 3.
```

This method will be envoked when it is interpolated:

```
const text = `Here are the steps: ${list}`;
// Here are the steps: Step 1. Step 2. Step 3.
```

#### toHTMLUnorderedList

Provides the list as an `HTMLUListElement`.

```js
list.toHTMLUnorderedList();
// <ul>
//   <li>Step 1</li>
//   <li>Step 2</li>
//   <li>Step 3</li>
// </ul>
```

If a step includes a mana symbol, it is automatically converted to an svg:

```js
list[1] === "Step 2 :manaw:";
list.toHTMLUnorderedList();
// <ul>
//   <li>Step 1</li>
//   <li>Step 2 <img src="https://c2.scryfall.com/file/scryfall-symbols/card-symbols/W.svg"></li>
//   <li>Step 3</li>
// </ul>
```

An options object can be passed when creating the list:

```
{
  className?: string;
}
```

`className` will apply a class name string to the `ul` element.

#### toHTMLOrderedList

Provides the list as an `HTMLOListElement`.

```js
list.toHTMLOrderedList();
// <ol>
//   <li>Step 1</li>
//   <li>Step 2</li>
//   <li>Step 3</li>
// </ol>
```

If a step includes a mana symbol, it is automatically converted to an svg:

```js
list[1] === "Step 2 :manaw:";
list.toHTMLOrderedList();
// <ol>
//   <li>Step 1</li>
//   <li>Step 2 <img src="https://c2.scryfall.com/file/scryfall-symbols/card-symbols/W.svg"></li>
//   <li>Step 3</li>
// </ol>
```

An options object can be passed when creating the list:

```
{
  className?: string;
}
```

`className` will apply a class name string to the `ol` element.

#### toMarkdown

Provides the list as a markdown string.

```js
list.toMarkdown();
// * Step 1
// * Step 2
// * Step 3
```

If a step includes a mana symbol, it is assumed that your markdown parser will handle the conversion.

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

If you find a bug, feel free to [open an issue](https://github.com/Commander-Spellbook/commander-spellbook-api-wrapper/issues/new) or [a Pull Request](https://github.com/Commander-Spellbook/commander-spellbook-api-wrapper/compare).
