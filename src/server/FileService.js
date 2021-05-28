import apiClient from "./api-client";

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
          data: folder
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
    documents = [].concat(documents);
    return Promise.all(
      documents.map(document =>
        apiClient.collaborationApi.updateDocument({
          cloudPk: project.cloud.id,
          projectPk: project.id,
          id: document.id,
          data: document
        })
      )
    );
  }

  deleteDocuments(project, documents) {
    documents = [].concat(documents);
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
