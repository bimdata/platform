/**
 * Client-side helpers to work with naming-constraint rules without round-trips
 * to the API (e.g. validate a name before starting a large upload).
 *
 * A rule has the shape:
 * {
 *   separator: "_",
 *   parts: [
 *     { type: "values_in", elements: ["ARC", "STR"] },
 *     { type: "bounded", min_value: 1, max_value: 99 },
 *     { type: "n_chars", max_length: 12 }
 *   ]
 * }
 *
 * Names are validated on the file name without its extension, the same way the
 * backend evaluates them.
 */

const PART_TYPES = Object.freeze({
  VALUES_IN: "values_in",
  BOUNDED: "bounded",
  N_CHARS: "n_chars",
});

/**
 * Strip the extension from a file name (e.g. "ARC_01.ifc" -> "ARC_01").
 * Names without an extension are returned unchanged.
 *
 * @param {String} name
 * @returns {String}
 */
function stripExtension(name) {
  const dotIndex = name.lastIndexOf(".");
  return dotIndex > 0 ? name.slice(0, dotIndex) : name;
}

/**
 * Check whether a single segment matches a rule part.
 *
 * @param {Object} part
 * @param {String} segment
 * @returns {Boolean}
 */
function matchPart(part, segment) {
  switch (part?.type) {
    case PART_TYPES.VALUES_IN:
      return Array.isArray(part.elements) && part.elements.includes(segment);
    case PART_TYPES.BOUNDED: {
      if (!/^\d+$/.test(segment)) return false;
      const value = Number(segment);
      return value >= part.min_value && value <= part.max_value;
    }
    case PART_TYPES.N_CHARS:
      return segment.length > 0 && segment.length <= part.max_length;
    default:
      return false;
  }
}

/**
 * Check whether a file name matches a naming-constraint rule.
 * Returns `true` when there is no rule (nothing to enforce).
 *
 * @param {String} name file name (with or without extension)
 * @param {Object|null} rule naming-constraint rule
 * @returns {Boolean}
 */
function matchName(name, rule) {
  if (!rule || !Array.isArray(rule.parts) || rule.parts.length === 0) {
    return true;
  }
  if (typeof name !== "string" || name.length === 0) return false;

  const baseName = stripExtension(name);
  const separator = rule.separator ?? "";
  const segments = separator === "" ? [baseName] : baseName.split(separator);

  if (segments.length !== rule.parts.length) return false;

  return rule.parts.every((part, index) => matchPart(part, segments[index]));
}

/**
 * Build a human-friendly example segment for a single rule part.
 *
 * - values_in -> first element if defined, otherwise "..."
 * - n_chars   -> "XXX"
 * - bounded   -> "[MIN-MAX]"
 *
 * @param {Object} part
 * @returns {String}
 */
function buildPartExample(part) {
  switch (part?.type) {
    case PART_TYPES.VALUES_IN:
      return part.elements?.[0] ?? "...";
    case PART_TYPES.BOUNDED:
      return `[${part.min_value}-${part.max_value}]`;
    case PART_TYPES.N_CHARS:
      return "XXX";
    default:
      return "";
  }
}

/**
 * Build a human-friendly example name from a rule, to preview the expected
 * format in the UI (e.g. "ARC_[1-99]_XXX").
 *
 * @param {Object|null} rule
 * @returns {String}
 */
function buildExample(rule) {
  if (!rule || !Array.isArray(rule.parts) || rule.parts.length === 0) {
    return "";
  }
  const separator = rule.separator ?? "";
  return rule.parts.map(buildPartExample).join(separator) + ".ext";
}

export { PART_TYPES, matchName, matchPart, buildExample, buildPartExample, stripExtension };
