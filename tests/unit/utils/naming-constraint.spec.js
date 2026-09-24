import {
  matchName,
  matchPart,
  buildExample,
  buildPartExample,
  stripExtension,
  PART_TYPES
} from "../../../src/utils/naming-constraint.js";

const rule = {
  separator: "_",
  parts: [
    { type: "values_in", elements: ["ARC", "STR"] },
    { type: "bounded", min_value: 1, max_value: 99 },
    { type: "n_chars", max_length: 12 }
  ]
};

describe("Naming constraint - stripExtension", () => {
  it("Should remove the extension", () => {
    expect(stripExtension("ARC_01_plan.ifc")).toBe("ARC_01_plan");
    expect(stripExtension("My.File.Name.pdf")).toBe("My.File.Name");
  });

  it("Should keep names without extension", () => {
    expect(stripExtension("ARC_01_plan")).toBe("ARC_01_plan");
    expect(stripExtension(".gitignore")).toBe(".gitignore");
  });
});

describe("Naming constraint - matchPart", () => {
  it("values_in matches only listed elements", () => {
    const part = { type: PART_TYPES.VALUES_IN, elements: ["ARC", "STR"] };
    expect(matchPart(part, "ARC")).toBe(true);
    expect(matchPart(part, "STR")).toBe(true);
    expect(matchPart(part, "MEP")).toBe(false);
    expect(matchPart(part, "arc")).toBe(false);
  });

  it("bounded matches integers within range", () => {
    const part = { type: PART_TYPES.BOUNDED, min_value: 1, max_value: 99 };
    expect(matchPart(part, "1")).toBe(true);
    expect(matchPart(part, "99")).toBe(true);
    expect(matchPart(part, "0")).toBe(false);
    expect(matchPart(part, "100")).toBe(false);
    expect(matchPart(part, "12a")).toBe(false);
    expect(matchPart(part, "")).toBe(false);
  });

  it("n_chars matches non-empty strings up to max length", () => {
    const part = { type: PART_TYPES.N_CHARS, max_length: 3 };
    expect(matchPart(part, "a")).toBe(true);
    expect(matchPart(part, "abc")).toBe(true);
    expect(matchPart(part, "abcd")).toBe(false);
    expect(matchPart(part, "")).toBe(false);
  });

  it("Unknown part type does not match", () => {
    expect(matchPart({ type: "unknown" }, "x")).toBe(false);
    expect(matchPart(undefined, "x")).toBe(false);
  });
});

describe("Naming constraint - matchName", () => {
  it("Should match valid names", () => {
    expect(matchName("ARC_01_plan", rule)).toBe(true);
    expect(matchName("STR_99_a", rule)).toBe(true);
    expect(matchName("ARC_5_groundfloor.ifc", rule)).toBe(true);
  });

  it("Should reject names with wrong segment count", () => {
    expect(matchName("ARC_01", rule)).toBe(false);
    expect(matchName("ARC_01_plan_extra", rule)).toBe(false);
  });

  it("Should reject names with invalid segments", () => {
    expect(matchName("MEP_01_plan", rule)).toBe(false);
    expect(matchName("ARC_0_plan", rule)).toBe(false);
    expect(matchName("ARC_100_plan", rule)).toBe(false);
    expect(matchName("ARC_01_thisnameistoolong", rule)).toBe(false);
  });

  it("Should treat empty or missing rule as always valid", () => {
    expect(matchName("anything", null)).toBe(true);
    expect(matchName("anything", { separator: "_", parts: [] })).toBe(true);
  });

  it("Should reject empty names against a real rule", () => {
    expect(matchName("", rule)).toBe(false);
  });

  it("Should support an empty separator (single part)", () => {
    const singleRule = {
      separator: "",
      parts: [{ type: "values_in", elements: ["ARC"] }]
    };
    expect(matchName("ARC", singleRule)).toBe(true);
    expect(matchName("ARC.ifc", singleRule)).toBe(true);
    expect(matchName("STR", singleRule)).toBe(false);
  });
});

describe("Naming constraint - buildExample", () => {
  it("Should build a human-friendly example", () => {
    expect(buildExample(rule)).toBe("ARC_[1-99]_XXX");
  });

  it("Should use placeholder when values_in has no elements", () => {
    const r = { separator: "-", parts: [{ type: "values_in", elements: [] }] };
    expect(buildExample(r)).toBe("...");
  });

  it("Should return an empty string for empty rules", () => {
    expect(buildExample(null)).toBe("");
    expect(buildExample({ separator: "_", parts: [] })).toBe("");
  });

  it("buildPartExample handles each type", () => {
    expect(buildPartExample({ type: "values_in", elements: ["A"] })).toBe("A");
    expect(buildPartExample({ type: "bounded", min_value: 1, max_value: 9 })).toBe("[1-9]");
    expect(buildPartExample({ type: "n_chars", max_length: 4 })).toBe("XXX");
  });
});
