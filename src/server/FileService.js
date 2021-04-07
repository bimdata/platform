import apiClient from "./api-client";

class FileService {
  fetchDocuments(project) {
    return apiClient.collaborationApi.getDocuments({
      cloudPk: project.cloud.id,
      projectPk: project.id
    });
  }

  // createDocument(project, document) {
  //   return apiClient.collaborationApi.createDocument({
  //     cloudPk: project.cloud.id,
  //     projectPk: project.id,
  //     data: document
  //   });
  // }

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
