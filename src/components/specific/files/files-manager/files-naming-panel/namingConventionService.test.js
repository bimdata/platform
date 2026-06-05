/**
 * Tests: namingConventionService.js
 * Run with: npx jest src/services/namingConventionService.test.js
 */

import {
  buildRuleRegex,
  validateFileName,
  buildHumanReadablePattern,
  suggestRenames,
  SEPARATOR_TYPES,
  SEGMENT_TYPES,
  RULE_MODES,
} from "./namingConventionService.js";

// ─── Test helpers ─────────────────────────────────────────────────────────────

function makeRule({ separator = "-", segments = [], mode = RULE_MODES.SOFT } = {}) {
  return { id: "r1", name: "Test", separator, segments, mode };
}

function seg_nchars(min, max) {
  return { type: SEGMENT_TYPES.N_CHARS, config: { min, max } };
}

function seg_bounded(min, max) {
  return { type: SEGMENT_TYPES.BOUNDED, config: { min, max } };
}

function seg_list(values) {
  return { type: SEGMENT_TYPES.LIST, config: { values } };
}

// ─── buildRuleRegex ───────────────────────────────────────────────────────────

describe("buildRuleRegex", () => {
  test("simple N chars + separator dash", () => {
    const rule = makeRule({
      separator: "-",
      segments: [seg_nchars(null, null), seg_nchars(null, null)],
    });
    const regex = buildRuleRegex(rule);
    expect(regex.test("ABC-DEF")).toBe(true);
    expect(regex.test("ABC")).toBe(false);
  });

  test("bounded segment matches range 1-50", () => {
    const rule = makeRule({
      separator: ".",
      segments: [seg_bounded(1, 50)],
    });
    const regex = buildRuleRegex(rule);
    expect(regex.test("1")).toBe(true);
    expect(regex.test("50")).toBe(true);
    expect(regex.test("51")).toBe(false);
    expect(regex.test("0")).toBe(false);
  });

  test("list segment matches allowed values only", () => {
    const rule = makeRule({
      separator: "_",
      segments: [seg_list(["STRUCT", "ELEC", "PLUMB"])],
    });
    const regex = buildRuleRegex(rule);
    expect(regex.test("STRUCT")).toBe(true);
    expect(regex.test("ELEC")).toBe(true);
    expect(regex.test("MECA")).toBe(false);
  });

  test("file extension is accepted", () => {
    const rule = makeRule({
      separator: "-",
      segments: [seg_nchars(null, null), seg_nchars(null, null)],
    });
    const regex = buildRuleRegex(rule);
    expect(regex.test("ABC-DEF.ifc")).toBe(true);
    expect(regex.test("ABC-DEF.pdf")).toBe(true);
  });

  test("complex rule: n_chars + bounded + list with dot separator", () => {
    // Pattern like: a.1.a
    const rule = makeRule({
      separator: ".",
      segments: [
        seg_nchars(null, null),
        seg_bounded(1, 99),
        seg_nchars(null, null),
      ],
    });
    const regex = buildRuleRegex(rule);
    expect(regex.test("20191002.1.Piping")).toBe(true);
    expect(regex.test("A.50.B")).toBe(true);
    expect(regex.test("A.100.B")).toBe(false);
  });
});

// ─── validateFileName ─────────────────────────────────────────────────────────

describe("validateFileName", () => {
  const rule = makeRule({
    separator: "-",
    segments: [seg_nchars(2, 8), seg_list(["WIP", "VAL", "ARCH"])],
  });

  test("valid file passes", () => {
    expect(validateFileName("ABC-WIP", rule).valid).toBe(true);
    expect(validateFileName("STRUCT-VAL", rule).valid).toBe(true);
    expect(validateFileName("STRUCT-VAL.ifc", rule).valid).toBe(true);
  });

  test("invalid file fails with reason", () => {
    const result = validateFileName("invalid_name", rule);
    expect(result.valid).toBe(false);
    expect(result.reason).toBeTruthy();
  });

  test("wrong list value fails", () => {
    expect(validateFileName("ABC-DRAFT", rule).valid).toBe(false);
  });
});

// ─── buildHumanReadablePattern ────────────────────────────────────────────────

describe("buildHumanReadablePattern", () => {
  test("n_chars segments show as 'a'", () => {
    const rule = makeRule({
      separator: ".",
      segments: [seg_nchars(null, null), seg_nchars(null, null)],
    });
    expect(buildHumanReadablePattern(rule)).toBe("a.a");
  });

  test("bounded shows min-max", () => {
    const rule = makeRule({
      separator: ".",
      segments: [seg_bounded(1, 50)],
    });
    expect(buildHumanReadablePattern(rule)).toBe("(1-50)");
  });

  test("list shows [liste]", () => {
    const rule = makeRule({
      separator: "-",
      segments: [seg_list(["A", "B"])],
    });
    expect(buildHumanReadablePattern(rule)).toBe("[liste]");
  });

  test("complex pattern (1-50).a.1.a.[liste]", () => {
    const rule = makeRule({
      separator: ".",
      segments: [
        seg_bounded(1, 50),
        seg_nchars(null, null),
        seg_bounded(1, 1),
        seg_nchars(null, null),
        seg_list(["elem", "type"]),
      ],
    });
    expect(buildHumanReadablePattern(rule)).toBe("(1-50).a.(1-1).a.[liste]");
  });
});

// ─── suggestRenames ───────────────────────────────────────────────────────────

describe("suggestRenames", () => {
  test("returns non-empty suggestions for non-conforming name", () => {
    const rule = makeRule({
      separator: ".",
      segments: [seg_nchars(null, null), seg_bounded(1, 99), seg_nchars(null, null)],
    });
    const suggestions = suggestRenames("20191002Mechanical Piping.ifc", rule);
    expect(suggestions.length).toBeGreaterThan(0);
    // Suggestions should differ from original
    suggestions.forEach((s) => {
      expect(s).not.toBe("20191002Mechanical Piping.ifc");
    });
  });

  test("preserves file extension in suggestions", () => {
    const rule = makeRule({
      separator: "-",
      segments: [seg_nchars(null, null), seg_list(["WIP"])],
    });
    const suggestions = suggestRenames("myfile.ifc", rule);
    suggestions.forEach((s) => {
      if (s.includes(".")) {
        expect(s.endsWith(".ifc")).toBe(true);
      }
    });
  });
});

// ─── Integration: checkFilesBeforeUpload ─────────────────────────────────────

describe("checkFilesBeforeUpload (store level, simulated)", () => {
  // Simulate the store logic directly
  function check(files, rule) {
    const { validateFiles } = require("./namingConventionService.js");
    const violations = [];
    const strictViolations = [];
    const results = validateFiles(files, rule);
    const invalid = results.filter((r) => !r.valid);
    for (const inv of invalid) {
      const entry = { ...inv, rule };
      violations.push(entry);
      if (rule.mode === RULE_MODES.STRICT) strictViolations.push(entry);
    }
    return {
      pass: violations.length === 0,
      violations,
      strictViolations,
      hasStrict: strictViolations.length > 0,
    };
  }

  const softRule = makeRule({
    separator: "-",
    segments: [seg_nchars(2, 8), seg_list(["WIP", "VAL"])],
    mode: RULE_MODES.SOFT,
  });

  const strictRule = makeRule({
    separator: "-",
    segments: [seg_nchars(2, 8), seg_list(["WIP", "VAL"])],
    mode: RULE_MODES.STRICT,
  });

  const validFile = { name: "STRUCT-WIP.ifc" };
  const invalidFile = { name: "random_file.ifc" };

  test("all valid files pass", () => {
    const result = check([validFile], softRule);
    expect(result.pass).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  test("soft violation does not trigger strict block", () => {
    const result = check([invalidFile], softRule);
    expect(result.pass).toBe(false);
    expect(result.hasStrict).toBe(false);
  });

  test("strict violation triggers block", () => {
    const result = check([invalidFile], strictRule);
    expect(result.pass).toBe(false);
    expect(result.hasStrict).toBe(true);
    expect(result.strictViolations).toHaveLength(1);
  });
});
