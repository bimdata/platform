import { download } from "@/utils/download";
import FILE_TYPES from "@/config/file-types";
import { segregate } from "@/utils/file-structure";
import apiClient from "./api-client";
import { ERRORS, RuntimeError, ErrorService } from "./ErrorService";

const FOLDER_UPDATABLE_FIELDS = ["name", "parentId", "defaultPermission"];
const DOCUMENT_UPDATABLE_FIELDS = ["name", "parentId"];

function createPayload(object, allowedFields) {
  const payload = {};
  for (const field of allowedFields) {
    payload[field] = object[field];
  }
  return payload;
}

const folderUpdatePayload = folder =>
  createPayload(folder, FOLDER_UPDATABLE_FIELDS);

const documentUpdatePayload = document =>
  createPayload(document, DOCUMENT_UPDATABLE_FIELDS);

class FileService {
  fetchFileStructure(project) {
    try {
      return apiClient.collaborationApi.getProjectDMSTree({
        cloudPk: project.cloud.id,
        id: project.id
      });
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.FILE_STRUCTURE_FETCH_ERROR, error)
      );
      return {};
    }
  }

  createFolder(project, folder) {
    try {
      return apiClient.collaborationApi.createFolder({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        data: folder
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.FOLDER_CREATE_ERROR, error);
    }
  }

  updateFolders(project, folders) {
    try {
      return Promise.all(
        folders.map(folder =>
          apiClient.collaborationApi.updateFolder({
            cloudPk: project.cloud.id,
            projectPk: project.id,
            id: folder.id,
            data: folderUpdatePayload(folder)
          })
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.FILE_UPDATE_ERROR, error);
    }
  }

  deleteFolders(project, folders) {
    try {
      return Promise.all(
        folders.map(folder =>
          apiClient.collaborationApi.deleteFolder({
            cloudPk: project.cloud.id,
            projectPk: project.id,
            id: folder.id
          })
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.FILE_DELETE_ERROR, error);
    }
  }

  updateDocuments(project, documents) {
    try {
      return Promise.all(
        documents.map(document =>
          apiClient.collaborationApi.updateDocument({
            cloudPk: project.cloud.id,
            projectPk: project.id,
            id: document.id,
            data: documentUpdatePayload(document)
          })
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.FILE_UPDATE_ERROR, error);
    }
  }

  deleteDocuments(project, documents) {
    try {
      return Promise.all(
        documents.map(document =>
          apiClient.collaborationApi.deleteDocument({
            cloudPk: project.cloud.id,
            projectPk: project.id,
            id: document.id
          })
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.FILE_DELETE_ERROR, error);
    }
  }

  downloadFiles(project, files, accessToken) {
    try {
      let downloadName, downloadUrl;
      if (files.length === 0) {
        return;
      }
      if (files.length === 1 && files[0].type !== FILE_TYPES.FOLDER) {
        downloadName = files[0].fileName;
        downloadUrl = files[0].file;
      } else {
        downloadName = project.name;
        downloadUrl = this.getArchiveUrl(project, files, accessToken);
      }
      return download({ name: downloadName, url: downloadUrl });
    } catch (error) {
      throw new RuntimeError(ERRORS.FILE_DOWNLOAD_ERROR, error);
    }
  }

  getArchiveUrl(project, files, accessToken) {
    const { folders, documents } = segregate(files);
    let url = "";
    if (folders.length > 0 || documents.length > 0) {
      url += `${process.env.VUE_APP_ARCHIVE_BASE_URL}/cloud/${project.cloud.id}/project/${project.id}?`;
      url += `accessToken=${accessToken}&`;
      url += folders.map(f => `folderId[]=${f.id}`).join("&");
      url += folders.length > 0 && documents.length > 0 ? "&" : "";
      url += documents.map(f => `documentId[]=${f.id}`).join("&");
    }
    return url;
  }
}

const service = new FileService();

export default service;
