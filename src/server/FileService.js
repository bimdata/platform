import apiClient from "./api-client";

const FOLDER_UPDATABLE_FIELDS = ["name", "parentId"];
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
    return apiClient.collaborationApi.getProjectDMSTree({
      cloudPk: project.cloud.id,
      id: project.id
    });
  }

  createFolder(project, folder) {
    return apiClient.collaborationApi.createFolder({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      data: folder
    });
  }

  updateFolders(project, folders) {
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
  }

  deleteFolders(project, folders) {
    return Promise.all(
      folders.map(folder =>
        apiClient.collaborationApi.deleteFolder({
          cloudPk: project.cloud.id,
          projectPk: project.id,
          id: folder.id
        })
      )
    );
  }

  updateDocuments(project, documents) {
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
  }

  deleteDocuments(project, documents) {
    return Promise.all(
      documents.map(document =>
        apiClient.collaborationApi.deleteDocument({
          cloudPk: project.cloud.id,
          projectPk: project.id,
          id: document.id
        })
      )
    );
  }

  getArchiveUrl(project, folders, documents, accessToken) {
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
