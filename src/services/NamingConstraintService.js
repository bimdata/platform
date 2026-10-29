import apiClient from "./api-client.js";
import { ERRORS, RuntimeError, ErrorService } from "./ErrorService.js";

/**
 * Thrown when a strict folder naming constraint cannot be applied because
 * existing documents in scope do not match the rule (API responds 409).
 * `documents` holds the conflicting `LightDocument[]` returned by the API.
 */
class NamingConstraintConflictError {
  constructor(documents) {
    this.documents = documents;
  }
}

/**
 * Thrown when a value list cannot be deleted because constraints use it (API responds 409).
 * `constraints` holds the `NamingConstraint[]` returned by the API.
 */
class NamingPartListInUseError {
  constructor(constraints) {
    this.constraints = constraints;
  }
}

const isResponse = (error) => typeof Response !== "undefined" && error instanceof Response;

// In-memory cache of effective folder rules, keyed by folder id, to avoid
// re-fetching the rule on every rename/upload within the same folder.
const folderRuleCache = new Map();

class NamingConstraintService {
  // --- Naming constraints catalog ------------------------------------------

  async fetchNamingConstraints(project) {
    try {
      return await apiClient.collaborationApi.getNamingConstraints(project.cloud.id, project.id);
    } catch (error) {
      ErrorService.handleError(new RuntimeError(ERRORS.NAMING_CONSTRAINTS_FETCH_ERROR, error));
      return [];
    }
  }

  async fetchNamingConstraint(project, constraint) {
    try {
      return await apiClient.collaborationApi.getNamingConstraint(
        project.cloud.id,
        constraint.id,
        project.id,
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.NAMING_CONSTRAINT_FETCH_ERROR, error);
    }
  }

  async createNamingConstraint(project, payload) {
    try {
      return await apiClient.collaborationApi.createNamingConstraint(
        project.cloud.id,
        project.id,
        payload,
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.NAMING_CONSTRAINT_CREATE_ERROR, error);
    }
  }

  // Resolve the effective naming rule applying to a folder, with its `strict`
  // flag. Returns null when no rule applies. Results are cached per folder id.
  async getEffectiveFolderRule(project, folder) {
    if (!folder?.id) return null;

    if (folderRuleCache.has(folder.id)) {
      return folderRuleCache.get(folder.id);
    }

    const folderConstraint = await this.fetchFolderNamingConstraint(project, folder);

    const constraint = folderConstraint?.constraint ?? null;

    const effective = constraint
      ? {
          id: constraint.id,
          separator: constraint.separator,
          parts: constraint.parts,
          strict: constraint.strict,
          name: constraint.name,
          recursive: !!folderConstraint.recursive,
          applied_on_folder_id: folderConstraint.applied_on_folder_id,
        }
      : null;

    folderRuleCache.set(folder.id, effective);

    return effective;
  }

  /**
   * Updates a naming constraint. Never blocking: its `conflicting_documents`
   * lists the documents now in conflict.
   */
  async updateNamingConstraint(project, constraint, payload) {
    try {
      const result = await apiClient.collaborationApi.updateNamingConstraint(
        project.cloud.id,
        constraint.id,
        project.id,
        payload,
      );
      this.clearFolderRuleCache();
      return result;
    } catch (error) {
      throw new RuntimeError(ERRORS.NAMING_CONSTRAINT_UPDATE_ERROR, error);
    }
  }

  async deleteNamingConstraint(project, constraint) {
    try {
      const response = await fetch(
        `${ENV.VUE_APP_API_BASE_URL}/cloud/${project.cloud.id}/project/${project.id}/naming-constraint/${constraint.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...apiClient.authHeader,
          },
        },
      );
      this.clearFolderRuleCache();
      if (response.status === 200) {
        const documents = await response.json();
        throw new NamingConstraintConflictError(documents);
      }
      if (response.status !== 204) {
        throw new RuntimeError(ERRORS.NAMING_CONSTRAINT_DELETE_ERROR, await response.text());
      }
    } catch (error) {
      throw new RuntimeError(ERRORS.NAMING_CONSTRAINT_DELETE_ERROR, error);
    }
  }

  // --- Naming part lists (value lists) -------------------------------------

  async fetchNamingPartLists(project) {
    try {
      return await apiClient.collaborationApi.getNamingConstraintPartLists(
        project.cloud.id,
        project.id,
      );
    } catch (error) {
      ErrorService.handleError(new RuntimeError(ERRORS.NAMING_PART_LISTS_FETCH_ERROR, error));
      return [];
    }
  }

  async createNamingPartList(project, payload) {
    try {
      return await apiClient.collaborationApi.createNamingConstraintPartList(
        project.cloud.id,
        project.id,
        payload,
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.NAMING_PART_LIST_CREATE_ERROR, error);
    }
  }

  /**
   * Updates a value list. Never blocking: its `conflicting_documents` lists
   * the documents now in conflict.
   */
  async updateNamingPartList(project, partList, payload) {
    try {
      const result = await apiClient.collaborationApi.updateNamingConstraintPartList(
        project.cloud.id,
        partList.id,
        project.id,
        payload,
      );
      this.clearFolderRuleCache();
      return result;
    } catch (error) {
      throw new RuntimeError(ERRORS.NAMING_PART_LIST_UPDATE_ERROR, error);
    }
  }

  /**
   * Throws `NamingPartListInUseError` (with `constraints`) when the list is
   * used by constraints (API responds 409).
   */
  async deleteNamingPartList(project, partList) {
    try {
      return await apiClient.collaborationApi.deleteNamingConstraintPartList(
        project.cloud.id,
        partList.id,
        project.id,
      );
    } catch (error) {
      if (isResponse(error) && error.status === 409) {
        const constraints = await error.json();
        throw new NamingPartListInUseError(constraints);
      }
      throw new RuntimeError(ERRORS.NAMING_PART_LIST_DELETE_ERROR, error);
    }
  }

  // --- Folder naming constraint --------------------------------------------

  /**
   * Returns the effective `FolderNamingConstraint` for a folder (may be
   * inherited from a recursive parent rule), or `null` when no rule applies
   * (API responds 404).
   */
  async fetchFolderNamingConstraint(project, folder) {
    try {
      return await apiClient.collaborationApi.getFolderNamingConstraint(
        project.cloud.id,
        folder.id,
        project.id,
      );
    } catch (error) {
      if (isResponse(error) && error.status === 404) {
        return null;
      }
      throw new RuntimeError(ERRORS.FOLDER_NAMING_CONSTRAINT_FETCH_ERROR, error);
    }
  }

  /**
   * Sets or replaces the naming constraint applied on a folder.
   * Resolves with the `FolderNamingConstraint` (its `conflicting_documents`
   * lists the non-blocking conflicts for non-strict rules).
   * Throws `NamingConstraintConflictError` (with `documents`) when a strict
   * rule conflicts with existing documents (API responds 409).
   */
  async setFolderNamingConstraint(project, folder, { constraint_id, recursive }) {
    try {
      const result = await apiClient.collaborationApi.setFolderNamingConstraint(
        project.cloud.id,
        folder.id,
        project.id,
        { constraint_id, recursive },
      );
      this.clearFolderRuleCache();
      return result;
    } catch (error) {
      if (isResponse(error) && error.status === 409) {
        const documents = await error.json();
        throw new NamingConstraintConflictError(documents);
      }
      throw new RuntimeError(ERRORS.FOLDER_NAMING_CONSTRAINT_SET_ERROR, error);
    }
  }

  /**
   * Removes the direct naming constraint of a folder.
   * Resolves with `[]` when removed cleanly (API responds 204), or with the
   * `LightDocument[]` newly conflicting with an inherited parent rule (API
   * responds 200 with a body).
   */
  async deleteFolderNamingConstraint(project, folder) {
    try {
      const documents = await apiClient.collaborationApi.deleteFolderNamingConstraint(
        project.cloud.id,
        folder.id,
        project.id,
      );
      this.clearFolderRuleCache();
      return documents ?? [];
    } catch (error) {
      if (isResponse(error) && error.status === 404) {
        return [];
      }
      if (error instanceof SyntaxError) {
        return [];
      }
      throw new RuntimeError(ERRORS.FOLDER_NAMING_CONSTRAINT_DELETE_ERROR, error);
    }
  }

  // --- Conflicting documents -----------------------------------------------

  /**
   * Lists documents flagged with `naming_constraint_conflict = true`.
   */
  async fetchConflictingDocuments(project) {
    try {
      return await apiClient.collaborationApi.getDocuments(
        project.cloud.id,
        project.id,
        undefined, // created_after
        undefined, // created_before
        undefined, // creator_email
        undefined, // description
        undefined, // description__contains
        undefined, // description__endswith
        undefined, // description__startswith
        undefined, // file_name
        undefined, // file_name__contains
        undefined, // file_name__endswith
        undefined, // file_name__startswith
        undefined, // file_type
        undefined, // has__visa
        undefined, // id__in
        undefined, // name
        undefined, // name__contains
        undefined, // name__endswith
        undefined, // name__startswith
        true, // naming_constraint_conflict
      );
    } catch (error) {
      ErrorService.handleError(new RuntimeError(ERRORS.CONFLICTING_DOCUMENTS_FETCH_ERROR, error));
      return [];
    }
  }

  clearFolderRuleCache() {
    folderRuleCache.clear();
  }
}

const service = new NamingConstraintService();

export { NamingConstraintConflictError, NamingPartListInUseError };

export default service;
