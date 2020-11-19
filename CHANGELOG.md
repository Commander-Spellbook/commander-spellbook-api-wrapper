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
