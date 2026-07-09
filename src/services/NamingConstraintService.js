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

const isResponse = (error) => typeof Response !== "undefined" && error instanceof Response;

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

  /**
   * Updates a naming constraint.
   * Resolves with the `NamingConstraint` (its `conflicting_documents` lists
   * the non-blocking conflicts for non-strict rules).
   * Throws `NamingConstraintConflictError` (with `documents`) when a strict
   * rule conflicts with existing documents (API responds 409).
   */
  async updateNamingConstraint(project, constraint, payload) {
    try {
      return await apiClient.collaborationApi.updateNamingConstraint(
        project.cloud.id,
        constraint.id,
        project.id,
        payload,
      );
    } catch (error) {
      if (isResponse(error) && error.status === 409) {
        const documents = await error.json();
        throw new NamingConstraintConflictError(documents);
      }
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

  // --- Naming parts templates ----------------------------------------------

  async fetchNamingPartsTemplates(project) {
    try {
      return await apiClient.collaborationApi.getNamingPartsTemplates(project.cloud.id, project.id);
    } catch (error) {
      ErrorService.handleError(new RuntimeError(ERRORS.NAMING_PARTS_TEMPLATES_FETCH_ERROR, error));
      return [];
    }
  }

  async createNamingPartsTemplate(project, payload) {
    try {
      return await apiClient.collaborationApi.createNamingPartsTemplate(
        project.cloud.id,
        project.id,
        payload,
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.NAMING_PARTS_TEMPLATE_CREATE_ERROR, error);
    }
  }

  async updateNamingPartsTemplate(project, template, payload) {
    try {
      return await apiClient.collaborationApi.updateNamingPartsTemplate(
        project.cloud.id,
        template.id,
        project.id,
        payload,
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.NAMING_PARTS_TEMPLATE_UPDATE_ERROR, error);
    }
  }

  async deleteNamingPartsTemplate(project, template) {
    try {
      return await apiClient.collaborationApi.deleteNamingPartsTemplate(
        project.cloud.id,
        template.id,
        project.id,
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.NAMING_PARTS_TEMPLATE_DELETE_ERROR, error);
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
      return await apiClient.collaborationApi.setFolderNamingConstraint(
        project.cloud.id,
        folder.id,
        project.id,
        { constraint_id, recursive },
      );
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
      return documents ?? [];
    } catch (error) {
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
}

const service = new NamingConstraintService();

export { NamingConstraintConflictError };

export default service;
