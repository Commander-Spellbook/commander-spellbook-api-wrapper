# unreleased

- `search`
  - Add ability to search for coloreless color identity with `ci:c` and `ci:colorless`
  - Add error messages for errors in query parsing
  - Add ability to search by number of cards in a combo
  - Support `cards` as alias for `card`
  - Support `-cards` as alias for `-card`

_Breaking Changes_

- `search`
  - Now returns a result object instead of an array of combos
  - Combos array found on the `combos` property of the result object
  - Errors in query are found in the `errors` property of the result object
- `ColorIdentity`
  - Remove `numberOfColors` in favor of `size`
- `CardGrouping`
  - Remove `matchesAll`
  - Remove `matchesAny`
- Remove methods that return HTML Elements

# 0.5.2

- `search`
  - Fix issue where parsing search caused an error in Safari browsers

# 0.5.1

- `search`
  - Fix issue where negated values with multiple options did not properly negate
  - Disregard capitalization for search keys

# 0.5.0

- Add `makeFakeCombo` method

# 0.4.0

- Fix issue where `parseQuery` was using an old module, causing all searches to fail
- `search`
  - Support numeric values for `coloridentity`

# 0.3.0

- Add `random` method
- Add `findById` method
- Support colloquial color names for color identity param
- `search`
  - Support `=`, `>`, `<`, `>=`, `<=` operators for `coloridentity`

# 0.2.0

- Add support for searching by id
- Add support for searching by prerequisites, steps and results

_Breaking Changes_

- Spellbook lookup now requires manually cache busting instead of automatically refreshing after 6 hours
- `commanderSpellbookId` is now a `string` instead of a `number`
- Change signature for `search` to take a string instead of an object
- `result` in Combo object is not `results`

# 0.1.1

- Fix issue where `getScryfallImageUrl` would not return proper version

# 0.1.0

- Initial release
