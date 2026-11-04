#! /usr/bin/env node

/* eslint-disable */

/**
 * Check that every translation key exists, with a non-empty value, in every
 * supported language.
 *
 * Supported languages are the ones available in `src/i18n/lang`.
 * Exit with code 1 if anything is missing.
 */

import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT_DIR = path.join(__dirname, "..");
const LANG_DIR = path.join(ROOT_DIR, "src/i18n/lang");
const I18N_INDEX_FILE = path.join(ROOT_DIR, "src/i18n/index.js");
const DATETIME_FILE = path.join(ROOT_DIR, "src/i18n/datetime.js");
const LANG_FILE_REGEXP = /^([a-z]{2})\.json$/;
const IS_GITHUB_ACTIONS = process.env.GITHUB_ACTIONS === "true";

const LANGUAGES = fs
  .readdirSync(LANG_DIR)
  .map(file => file.match(LANG_FILE_REGEXP)?.[1])
  .filter(Boolean)
  .sort();

const errors = [];

function report(file, message) {
  errors.push({ file: path.relative(ROOT_DIR, file), message });
}

function flatten(obj, prefix = "", acc = new Map()) {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      flatten(value, fullKey, acc);
    } else {
      acc.set(fullKey, value);
    }
  }
  return acc;
}

/**
 * Every key found in any language must exist with a non-empty string value
 * in all languages.
 */
function checkLangFiles() {
  const translations = {};
  for (const lang of LANGUAGES) {
    const file = path.join(LANG_DIR, `${lang}.json`);
    try {
      translations[lang] = flatten(JSON.parse(fs.readFileSync(file, "utf-8")));
    } catch (error) {
      report(file, `Invalid JSON: ${error.message}`);
    }
  }

  const allKeys = new Set(
    Object.values(translations).flatMap(keys => [...keys.keys()])
  );

  for (const [lang, keys] of Object.entries(translations)) {
    const file = path.join(LANG_DIR, `${lang}.json`);
    const missing = [...allKeys].filter(key => !keys.has(key)).sort();
    const empty = [...keys]
      .filter(([, value]) => typeof value !== "string" || value.trim() === "")
      .map(([key]) => key)
      .sort();
    if (missing.length > 0) {
      report(file, `${missing.length} missing key(s): ${missing.join(", ")}`);
    }
    if (empty.length > 0) {
      report(file, `${empty.length} empty or non-string value(s): ${empty.join(", ")}`);
    }
  }
}

/**
 * Check that every language is registered in the given source file.
 */
function checkRegistration(file, pattern) {
  const source = fs.readFileSync(file, "utf-8");
  const missing = LANGUAGES.filter(lang => !pattern(lang).test(source));
  if (missing.length > 0) {
    report(file, `Language(s) not registered: ${missing.join(", ")}`);
  }
}

// ~~~{ Main }~~~

checkLangFiles();
checkRegistration(I18N_INDEX_FILE, lang => new RegExp(`import\\s+${lang}\\s+from\\s+["']\\./lang/${lang}\\.json["']`));
checkRegistration(DATETIME_FILE, lang => new RegExp(`\\b${lang}\\s*:`));

if (errors.length > 0) {
  for (const { file, message } of errors) {
    if (IS_GITHUB_ACTIONS) {
      console.log(`::error file=${file}::${message}`);
    } else {
      console.error(`✖ ${file}: ${message}`);
    }
  }
  console.error(`\ni18n check failed: ${errors.length} error(s) for languages [${LANGUAGES.join(", ")}].`);
  process.exit(1);
}

console.log(`i18n check passed for languages [${LANGUAGES.join(", ")}].`);
