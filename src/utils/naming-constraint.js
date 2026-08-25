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
 * Strip the extension from a file name.
 *
 * @param {String} name
 * @returns {String}
 */
function stripExtension(name) {
  const dotIndex = name.lastIndexOf(".");
  return dotIndex > 0 ? name.slice(0, dotIndex) : name;
}

/**
 * Get the file extension.
 *
 * @param {String} name
 * @returns {String}
 */
function getExtension(name) {
  const dotIndex = name.lastIndexOf(".");
  return dotIndex > 0 ? name.slice(dotIndex) : "";
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
      if (!/^\d+$/.test(segment)) {
        return false;
      }

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
 * Parse a filename according to a naming constraint rule.
 *
 * This cannot rely on String.split() because the separator can also be part
 * of a valid value. For example, with "-" as separator:
 *
 *   rule.parts[0] = { type: "values_in", elements: ["A-B"] }
 *
 * The parser therefore tries valid values for each part and only treats the
 * separator as a delimiter when the remaining parts can also be matched.
 *
 * @param {String} name
 * @param {Object|null} rule
 * @returns {String[]|null}
 */
function parseNameParts(name, rule) {
  if (!rule?.parts?.length || typeof name !== "string" || !name.length) {
    return null;
  }

  const baseName = stripExtension(name);
  const separator = rule.separator ?? "";

  if (!separator) {
    return rule.parts.length === 1 ? [baseName] : null;
  }

  const parsePart = (value, partIndex) => {
    const part = rule.parts[partIndex];
    const isLastPart = partIndex === rule.parts.length - 1;

    for (let end = 1; end <= value.length; end++) {
      const candidate = value.slice(0, end);

      if (!matchPart(part, candidate)) {
        continue;
      }

      const remaining = value.slice(end);

      if (isLastPart) {
        if (!remaining) {
          return [candidate];
        }

        continue;
      }

      if (!remaining.startsWith(separator)) {
        continue;
      }

      const parsedRemaining = parsePart(remaining.slice(separator.length), partIndex + 1);

      if (parsedRemaining) {
        return [candidate, ...parsedRemaining];
      }
    }

    return null;
  };

  return parsePart(baseName, 0);
}

/**
 * Check whether a file name matches a naming-constraint rule.
 *
 * Returns true when there is no rule (nothing to enforce).
 *
 * @param {String} name
 * @param {Object|null} rule
 * @returns {Boolean}
 */
function matchName(name, rule) {
  if (!rule?.parts?.length) {
    return true;
  }

  return parseNameParts(name, rule) !== null;
}

/**
 * Build a human-friendly example segment for a single rule part.
 *
 * Uses the part name when available.
 *
 * @param {Object} part
 * @returns {String}
 */
function buildPartExample(part) {
  return part?.name ?? "";
}

/**
 * Build a human-friendly example name from a rule.
 *
 * @param {Object|null} rule
 * @returns {String}
 */
function buildExample(rule) {
  if (!rule?.parts?.length) {
    return "";
  }

  const separator = rule.separator ?? "";

  return `${rule.parts.map(buildPartExample).join(separator)}.ext`;
}

/**
 * Build default editable values for a rule.
 *
 * @param {String} basename
 * @param {Object} rule
 * @returns {String[]}
 */
function buildDefaultValues(basename, rule) {
  return rule.parts.map((part) => {
    switch (part.type) {
      case PART_TYPES.VALUES_IN:
        return part.elements?.[0] ?? "";

      case PART_TYPES.BOUNDED:
        return part.min_value ?? "";

      case PART_TYPES.N_CHARS:
        return basename;

      default:
        return "";
    }
  });
}

/**
 * Split a filename into editable values and extension.
 *
 * @param {String} name
 * @param {Object} rule
 * @returns {{values: String[], extension: String}}
 */
function splitName(name, rule) {
  if (!rule) {
    return {
      values: [],
      extension: "",
    };
  }

  const extension = getExtension(name);
  const parsedValues = parseNameParts(name, rule);

  if (parsedValues) {
    return {
      values: parsedValues,
      extension,
    };
  }

  return {
    values: buildDefaultValues(stripExtension(name), rule),
    extension,
  };
}

/**
 * Left-pad a bounded value according to its max_value.
 *
 * max_value=999 -> 001
 * max_value=99 -> 01
 *
 * @param {String|Number} value
 * @param {Object} part
 * @returns {String}
 */
function padBoundedValue(value, part) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  const digits = String(part.max_value).length;

  return String(value).padStart(digits, "0");
}

/**
 * Build a filename from rule values.
 *
 * @param {String[]} values
 * @param {Object} rule
 * @param {String} extension
 * @returns {String}
 */
function buildName(values, rule, extension = "") {
  if (!rule) {
    return "";
  }

  const separator = rule.separator ?? "";

  const name = values
    .map((value, index) => {
      const part = rule.parts[index];

      if (part?.type === PART_TYPES.BOUNDED) {
        return padBoundedValue(value, part);
      }

      return value;
    })
    .join(separator);

  return name + extension;
}

export {
  PART_TYPES,
  matchName,
  matchPart,
  parseNameParts,
  buildExample,
  buildPartExample,
  stripExtension,
  splitName,
  padBoundedValue,
  buildName,
};
