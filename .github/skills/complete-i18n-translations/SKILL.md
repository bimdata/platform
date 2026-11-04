---
name: complete-i18n-translations
description: "Use when adding, changing, or reviewing i18n strings, translation keys, or src/i18n/lang/*.json files. Ensure every supported language is complete before finishing."
---

# Complete i18n translations

When changing user-facing text or translation keys, complete all supported
translations in the same change. Do not leave missing keys, empty values, or
English placeholders in other locales.

## Supported languages

The translation files are in `src/i18n/lang/`. The current supported languages
are `de`, `en`, `es`, `fr`, `it`, `nl`, and `no`. Check the files in that
directory, `src/i18n/index.js` and `src/i18n/datetime.js` if the supported
locales may have changed; do not rely on a hard-coded list if the repository
has moved on.

## Procedure

1. Add every new key, with an accurate, non-empty translation, to every
   supported locale in `src/i18n/lang/<locale>.json`. When changing a string,
   update all locale versions of that key. Preserve nested JSON structure,
   placeholders (such as `{name}`), plural forms (`singular | plural`), and
   existing terminology.
2. When removing a key from the code, remove it from every locale.
3. When adding a new language, add its `lang/<locale>.json` file and register
   it in both `src/i18n/index.js` and `src/i18n/datetime.js`.
4. If a translation is uncertain, do not silently copy English into another
   locale as a placeholder. Ask for a translation decision or clearly flag
   the unresolved language to the user.
5. Run `npm run i18n:check` and resolve every reported issue. This check
   validates key parity, non-empty string values, locale registration, and
   JSON validity. It is required before reporting i18n work as complete.

## Completion criteria

- All translation files contain the changed keys in every supported language.
- No translation value is empty or a placeholder copied from another locale
  without an explicit decision.
- Every supported locale is registered in `src/i18n/index.js` and
  `src/i18n/datetime.js`.
- `npm run i18n:check` passes.
