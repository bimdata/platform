import apiClient from "./api-client";

const FOLDER_UPDATABLE_FIELDS = ["name", "parentId"];
const DOCUMENT_UPDATABLE_FIELDS = ["name", "description", "parentId"];

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
    folders = [folders].flat();
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
    folders = [folders].flat();
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

  createDocument(project, document) {
    return apiClient.collaborationApi.createDocument({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      data: document
    });
  }

  updateDocuments(project, documents) {
    documents = [documents].flat();
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
    documents = [documents].flat();
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
}

const service = new FileService();

export default service;
