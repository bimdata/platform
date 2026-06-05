/**
 * Naming Convention Store (Pinia)
 * Manages naming rules state, CRUD, and folder associations.
 *
 * Assumes BIMData API base: https://api.bimdata.io
 * Endpoints are mocked here — adapt to real platform-back routes when available.
 */

// import { defineStore } from "pinia";
import { ref, computed, toRaw } from "vue";
import {
  validateFiles,
  buildHumanReadablePattern,
  RULE_MODES,
} from "../services/NamingConvention.js";
import { useUser } from "./user.js";

// ─── Store ────────────────────────────────────────────────────────────────────

// State
const rules = ref([]); // NamingRule[]
const customLists = ref([]); // CustomList[]
const loading = ref(false);
const error = ref(null);

// ── Getters ──────────────────────────────────────────────────────────────

const getRulesForFolder = computed(() => (folderId) => {
  return rules.value.filter((r) => r.active && r.folder_ids?.includes(folderId));
});

const getRecursiveRulesForFolder = computed(() => (folder) => {
  return rules.value.filter(
    (r) => r.active && r.recursive && r.folder_ids?.some((fid) => isAncestorId(fid, folder)),
  );
});

function isAncestorId(ancestorId, folder) {
  // Walk up parent_id chain in current rules context
  // In real usage, pass folder tree from GED store
  let cur = folder;
  while (cur?.parent_id) {
    if (cur.parent_id === ancestorId) return true;
    cur = { id: cur.parent_id, parent_id: null };
  }
  return false;
}

// All rules that apply to a folder (direct + recursive parents)
const getEffectiveRulesForFolder = computed(() => (folder) => {
  const direct = getRulesForFolder.value(folder.id);
  const recursive = getRecursiveRulesForFolder.value(folder);
  // Merge, deduplicate by id
  const all = [...direct, ...recursive];
  return all.filter((r, i) => all.findIndex((x) => x.id === r.id) === i);
});

// ── Actions ───────────────────────────────────────────────────────────────

/**
 * Load rules for a project from the API.
 * Route: GET /cloud/:cloudPk/project/:projectPk/naming-rules
 */
async function fetchRules(cloudPk, projectPk, apiClient) {
  loading.value = true;
  error.value = null;
  try {
    // When platform-back implements this endpoint:
    // const data = await apiClient.get(`/cloud/${cloudPk}/project/${projectPk}/naming-rules`);
    // rules.value = data;

    // For now: load from localStorage as dev stub
    const key = `naming_rules_${projectPk}`;
    const stored = localStorage.getItem(key);
    rules.value = stored ? JSON.parse(stored) : [];
    console.log("fetchRules →", rules.value);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

/**
 * Persist rules to API.
 * Route: POST /cloud/:cloudPk/project/:projectPk/naming-rules
 */
async function saveRule(cloudPk, projectPk, ruleData, apiClient) {
  const { user } = useUser();
  loading.value = true;
  try {
    const id = ruleData.id || crypto.randomUUID();
    const rule = {
      ...toRaw(ruleData),
      id,
      folder_ids: toRaw(ruleData.folder_ids) || [],
      segments: toRaw(ruleData.segments) || [],
      creator_id: ruleData.creator_id || user.value?.id,
      creator_name:
        ruleData.creator_name || `${user.value?.firstname} ${user.value?.lastname}`.trim(),
      creator_email: ruleData.creator_email || user.value?.email,
      creator_picture: ruleData.creator_picture || user.value?.profile_picture,
      created_at: ruleData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      pattern: buildHumanReadablePattern(ruleData),
      active: true,
    };

    const idx = rules.value.findIndex((r) => r.id === rule.id);
    if (idx >= 0) {
      rules.value[idx] = rule;
    } else {
      rules.value.push(rule);
    }

    // Stub: persist locally
    localStorage.setItem(`naming_rules_${projectPk}`, JSON.stringify(rules.value));

    return rule;
  } catch (e) {
    error.value = e.message;
    throw e;
  } finally {
    loading.value = false;
  }
}

/**
 * Delete a rule.
 * Route: DELETE /cloud/:cloudPk/project/:projectPk/naming-rules/:id
 */
async function deleteRule(ruleId, projectPk) {
  rules.value = rules.value.filter((r) => r.id !== ruleId);
  localStorage.setItem(`naming_rules_${projectPk}`, JSON.stringify(rules.value));
}

/**
 * Assign a rule to one or more folders.
 */
function assignRuleToFolder(ruleId, folderId) {
  const rule = rules.value.find((r) => r.id === ruleId);
  if (!rule) return;
  if (!rule.folder_ids) rule.folder_ids = [];
  if (!rule.folder_ids.includes(folderId)) {
    rule.folder_ids.push(folderId);
  }
}

function unassignRuleFromFolder(ruleId, folderId) {
  const rule = rules.value.find((r) => r.id === ruleId);
  if (!rule) return;
  rule.folder_ids = (rule.folder_ids || []).filter((id) => id !== folderId);
}

// ── Custom Lists ──────────────────────────────────────────────────────────

async function fetchCustomLists(projectPk) {
  const key = `naming_lists_${projectPk}`;
  const stored = localStorage.getItem(key);
  customLists.value = stored ? JSON.parse(stored) : [];
}

function saveCustomList(projectPk, listData) {
  const list = {
    id: listData.id || crypto.randomUUID(),
    ...listData,
  };
  const idx = customLists.value.findIndex((l) => l.id === list.id);
  if (idx >= 0) {
    customLists.value[idx] = list;
  } else {
    customLists.value.push(list);
  }
  localStorage.setItem(`naming_lists_${projectPk}`, JSON.stringify(customLists.value));
  return list;
}

// ── File Validation ───────────────────────────────────────────────────────

/**
 * Check files before upload against rules of the target folder.
 * Returns { pass: bool, violations: [], strictViolations: [] }
 */
function checkFilesBeforeUpload(files, targetFolder) {
  const effectiveRules = getEffectiveRulesForFolder.value(targetFolder);
  if (!effectiveRules.length) return { pass: true, violations: [], strictViolations: [] };

  const violations = [];
  const strictViolations = [];

  for (const rule of effectiveRules) {
    const results = validateFiles(files, rule);
    const invalid = results.filter((r) => !r.valid);
    for (const inv of invalid) {
      const entry = { ...inv, rule };
      violations.push(entry);
      if (rule.mode === RULE_MODES.STRICT) {
        strictViolations.push(entry);
      }
    }
  }

  return {
    pass: violations.length === 0,
    violations,
    strictViolations,
    hasStrict: strictViolations.length > 0,
  };
}

export function useNamingConventionStore() {
  return {
    // State
    rules,
    customLists,
    loading,
    error,
    // Getters
    getRulesForFolder,
    getEffectiveRulesForFolder,
    // Actions
    fetchRules,
    saveRule,
    deleteRule,
    assignRuleToFolder,
    unassignRuleFromFolder,
    fetchCustomLists,
    saveCustomList,
    checkFilesBeforeUpload,
  };
}
