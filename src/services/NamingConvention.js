// ─── Constants ────────────────────────────────────────────────────────────────

export const SEPARATOR_TYPES = {
  DASH: { value: "-", label: "- (tiret)" },
  DOT: { value: ".", label: ". (point)" },
  UNDERSCORE: { value: "_", label: "_ (trait de soulignement)" },
};

export const SEGMENT_TYPES = {
  N_CHARS: "n_chars",
  BOUNDED: "bounded",
  LIST: "list",
};

export const RULE_MODES = {
  SOFT: "soft", // warn but allow
  STRICT: "strict", // block until renamed
};

// ─── Regex Builder ────────────────────────────────────────────────────────────

/**
 * Build a regex pattern from a rule definition.
 * @param {Object} rule - The naming rule object
 * @returns {RegExp}
 */
export function buildRuleRegex(rule) {
  const sep = escapeRegex(rule.separator);
  const parts = rule.segments.map((seg) => buildSegmentPattern(seg));
  const pattern = parts.join(sep);
  // Allow optional file extension at the end
  return new RegExp(`^${pattern}(\\.[a-zA-Z0-9]+)?$`);
}

function buildSegmentPattern(segment) {
  switch (segment.type) {
    case SEGMENT_TYPES.N_CHARS: {
      const { min, max } = segment.config;
      if (min && max) return `[\\w\\-]{${min},${max}}`;
      if (min) return `[\\w\\-]{${min},}`;
      if (max) return `[\\w\\-]{1,${max}}`;
      return `[\\w\\-]+`;
    }
    case SEGMENT_TYPES.BOUNDED: {
      const { min, max } = segment.config;
      // Numeric range
      return `(${generateNumericRange(min, max)})`;
    }
    case SEGMENT_TYPES.LIST: {
      const values = segment.config.values || [];
      if (!values.length) return `[\\w\\-]+`;
      return `(${values.map(escapeRegex).join("|")})`;
    }
    default:
      return `[\\w\\-]+`;
  }
}

/**
 * Generate a regex alternation for a numeric range like 1-50.
 * Falls back to simple \d+ if range is too large.
 */
function generateNumericRange(min, max) {
  if (!min && !max) return `\\d+`;
  const mn = parseInt(min, 10);
  const mx = parseInt(max, 10);
  if (isNaN(mn) || isNaN(mx) || mx - mn > 200) return `\\d+`;
  const nums = [];
  for (let i = mn; i <= mx; i++) nums.push(String(i));
  return nums.join("|");
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Validate a file name against a naming rule.
 * Returns { valid: bool, reason: string|null }
 */
export function validateFileName(fileName, rule) {
  // Strip extension for validation
  const nameWithoutExt = stripExtension(fileName);
  const regex = buildRuleRegex(rule);
  const valid = regex.test(nameWithoutExt) || regex.test(fileName);
  return {
    valid,
    reason: valid
      ? null
      : `Le nom "${fileName}" ne correspond pas au format attendu : ${buildHumanReadablePattern(rule)}`,
  };
}

/**
 * Validate a list of files against a rule.
 * Returns array of { file, valid, reason }
 */
export function validateFiles(files, rule) {
  return files.map((file) => ({
    file,
    ...validateFileName(file.name || file.file_name, rule),
  }));
}

/**
 * Build a human-readable pattern description for display in UI.
 * e.g. "a.1.a" or "(1-50).a.1.a.[liste]"
 */
export function buildHumanReadablePattern(rule) {
  const sep = rule.separator;
  return rule.segments
    .map((seg) => {
      switch (seg.type) {
        case SEGMENT_TYPES.N_CHARS:
          return "a";
        case SEGMENT_TYPES.BOUNDED:
          return `(${seg.config.min}-${seg.config.max})`;
        case SEGMENT_TYPES.LIST:
          return "[liste]";
        default:
          return "?";
      }
    })
    .join(sep);
}

// ─── Suggestion Engine ────────────────────────────────────────────────────────

/**
 * Suggest renamed variants for a non-conforming file.
 * Returns up to 3 suggestions.
 */
export function suggestRenames(fileName, rule) {
  const nameWithoutExt = stripExtension(fileName);
  const ext = getExtension(fileName);
  const sep = rule.separator;
  const parts = nameWithoutExt.split(/[\.\-_]/);

  const suggestions = [];

  // Strategy 1: pad/trim parts to match segment count
  if (rule.segments.length > 0) {
    const padded = rule.segments.map((seg, i) => {
      const part = parts[i] || getDefaultValue(seg);
      return conformPart(part, seg);
    });
    suggestions.push(padded.join(sep) + (ext ? `.${ext}` : ""));
  }

  // Strategy 2: insert index
  if (rule.segments.length > 1) {
    const variant = [
      ...(suggestions[0]
        ? suggestions[0].replace(ext ? `.${ext}` : "", "").split(sep)
        : rule.segments.map((s) => getDefaultValue(s))),
    ];
    variant[0] = (variant[0] || "A") + "2";
    suggestions.push(variant.join(sep) + (ext ? `.${ext}` : ""));
  }

  // Deduplicate & filter valid
  return [...new Set(suggestions)].filter((s) => s !== fileName && s.trim() !== "");
}

function conformPart(part, segment) {
  switch (segment.type) {
    case SEGMENT_TYPES.N_CHARS: {
      const { min, max } = segment.config;
      if (max && part.length > max) return part.slice(0, max);
      if (min && part.length < min) return part.padEnd(min, "0");
      return part;
    }
    case SEGMENT_TYPES.BOUNDED: {
      const num = parseInt(part, 10);
      const mn = parseInt(segment.config.min, 10);
      const mx = parseInt(segment.config.max, 10);
      if (isNaN(num)) return String(mn || 1);
      if (!isNaN(mn) && num < mn) return String(mn);
      if (!isNaN(mx) && num > mx) return String(mx);
      return String(num);
    }
    case SEGMENT_TYPES.LIST: {
      const values = segment.config.values || [];
      if (!values.length) return part;
      return values.includes(part) ? part : values[0];
    }
    default:
      return part;
  }
}

function getDefaultValue(segment) {
  switch (segment.type) {
    case SEGMENT_TYPES.N_CHARS:
      return "A";
    case SEGMENT_TYPES.BOUNDED:
      return String(segment.config.min || 1);
    case SEGMENT_TYPES.LIST:
      return (segment.config.values || ["val"])[0];
    default:
      return "x";
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function stripExtension(fileName) {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1) return fileName;
  return fileName.slice(0, lastDot);
}

export function getExtension(fileName) {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1) return "";
  return fileName.slice(lastDot + 1);
}

/**
 * Check if a folder has an active naming rule.
 * Returns the matching rule or null.
 */
export function getActiveRuleForFolder(folder, rules) {
  // Direct assignment
  const direct = rules.find((r) => r.folder_ids?.includes(folder.id) && r.active);
  if (direct) return direct;

  // Recursive rules from parent folders
  const recursive = rules.find(
    (r) =>
      r.recursive &&
      r.active &&
      r.folder_ids?.some((fid) => isAncestor(fid, folder, /* tree */ [])),
  );
  return recursive || null;
}

function isAncestor(ancestorId, folder, _tree) {
  // Traverse parent_id chain — tree traversal handled at store level
  let current = folder;
  while (current?.parent_id) {
    if (current.parent_id === ancestorId) return true;
    current = { id: current.parent_id, parent_id: null }; // simplified
  }
  return false;
}
