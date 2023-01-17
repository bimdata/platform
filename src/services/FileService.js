import { FILE_TYPE } from "../config/files.js";
import { download } from "../utils/download.js";
import { segregate } from "../utils/file-structure.js";
import {
  getPaths,
  handleInputFiles,
  createFolderTree,
  handleDragAndDropFile,
  removeRootFolder
} from "../utils/files.js";

import apiClient from "./api-client.js";
import { ERRORS, RuntimeError, ErrorService } from "./ErrorService.js";

const FOLDER_UPDATABLE_FIELDS = ["name", "parent_id", "default_permission"];
const DOCUMENT_UPDATABLE_FIELDS = ["name", "parent_id"];

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
  async fetchFileStructure(project) {
    try {
      return await apiClient.collaborationApi.getProjectDMSTree(
        project.cloud.id,
        project.id
      );
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.FILE_STRUCTURE_FETCH_ERROR, error)
      );
      return {};
    }
  }

  async createFileStructure(project, body) {
    try {
      return await apiClient.collaborationApi.createDMSTree(
        project.cloud.id,
        project.id,
        body
      );
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.FILE_STRUCTURE_CREATE_ERROR, error)
      );
    }
  }

  async fetchFolder(project, folder) {
    try {
      return await apiClient.collaborationApi.getFolder(
        project.cloud.id,
        folder.id,
        project.id
      );
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.FOLDER_FETCH_ERROR, error)
      );
      return {};
    }
  }

  async createFolder(project, folder) {
    try {
      return await apiClient.collaborationApi.createFolder(
        project.cloud.id,
        project.id,
        folder
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.FOLDER_CREATE_ERROR, error);
    }
  }

  async updateFolders(project, folders) {
    try {
      return await Promise.all(
        folders.map(folder =>
          apiClient.collaborationApi.updateFolder(
            project.cloud.id,
            folder.id,
            project.id,
            folderUpdatePayload(folder)
          )
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.FILE_UPDATE_ERROR, error);
    }
  }

  async deleteFolders(project, folders) {
    try {
      return await Promise.all(
        folders.map(folder =>
          apiClient.collaborationApi.deleteFolder(
            project.cloud.id,
            folder.id,
            project.id
          )
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.FILE_DELETE_ERROR, error);
    }
  }

  async getDocument(project, document) {
    try {
      return await apiClient.collaborationApi.getDocument(
        project.cloud.id,
        document.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.FILE_FETCH_ERROR, error);
    }
  }

  async updateDocuments(project, documents) {
    try {
      return await Promise.all(
        documents.map(document =>
          apiClient.collaborationApi.updateDocument(
            project.cloud.id,
            document.id,
            project.id,
            documentUpdatePayload(document)
          )
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.FILE_UPDATE_ERROR, error);
    }
  }

  async deleteDocuments(project, documents) {
    try {
      return await Promise.all(
        documents.map(document =>
          apiClient.collaborationApi.deleteAllDocumentHistory(
            project.cloud.id,
            document.id,
            project.id
          )
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.FILE_DELETE_ERROR, error);
    }
  }

  async deleteDocVersion(project, document) {
    try {
      return await apiClient.collaborationApi.deleteDocument(
        project.cloud.id,
        document.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.FILE_VERSIONS_DELETE_ERROR, error);
    }
  }

  async downloadFiles(project, files, accessToken) {
    try {
      let downloadName, downloadUrl;
      if (files.length === 0) {
        return;
      }
      if (files.length === 1 && files[0].type !== FILE_TYPE.FOLDER) {
        downloadName = files[0].file_name;
        downloadUrl = files[0].file;
      } else {
        downloadName = project.name;
        downloadUrl = this.getArchiveUrl(project, files, accessToken);
      }
      return await download({ name: downloadName, url: downloadUrl });
    } catch (error) {
      throw new RuntimeError(ERRORS.FILE_DOWNLOAD_ERROR, error);
    }
  }

  getArchiveUrl(project, files, accessToken) {
    const { folders, documents } = segregate(files);
    let url = "";
    if (folders.length > 0 || documents.length > 0) {
      url += `${ENV.VUE_APP_ARCHIVE_BASE_URL}/cloud/${project.cloud.id}/project/${project.id}?`;
      url += `accessToken=${accessToken}&`;
      url += folders.map(f => `folderId[]=${f.id}`).join("&");
      url += folders.length > 0 && documents.length > 0 ? "&" : "";
      url += documents.map(f => `documentId[]=${f.id}`).join("&");
    }
    return url;
  }

  async getDocumentVersions(project, document) {
    try {
      return await apiClient.collaborationApi.getDocumentHistories(
        project.cloud.id,
        document.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.FILE_VERSIONS_FETCH_ERROR, error);
    }
  }

  async makeHeadVersion(project, headDocument, document) {
    try {
      return await apiClient.collaborationApi.makeHeadVersionDocumentHistory(
        project.cloud.id,
        headDocument.id,
        document.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.FILE_VERSIONS_MAKE_HEAD_ERROR, error);
    }
  }

  async createFolderStructure(project, currentFolder, files, destFolder) {
    let currentFiles = [];

    if (files.isDirectory) {
      currentFiles.push(await handleDragAndDropFile(files));
    } else {
      currentFiles.push(handleInputFiles(files));
    }

    const createdFolders = await Promise.all(
      currentFiles.map(async files => {
        const paths = getPaths(files);
        const rootFolder = await this.createFolder(project, {
          parent_id: destFolder?.id ?? currentFolder.id,
          name: paths[0][0]
        });
        const tree = createFolderTree(rootFolder, removeRootFolder(paths));

        const getRootFolderNode = (id, node) => {
          if (node.id === id) {
            return node;
          } else {
            for (const child of node.children ?? []) {
              const rootFolderNode = getRootFolderNode(id, child);
              if (rootFolderNode) return rootFolderNode;
            }
          }
        };

        try {
          const DMSTree = await apiClient.collaborationApi.createDMSTree(
            project.cloud.id,
            project.id,
            tree
          );

          const rootFolderNode = getRootFolderNode(rootFolder.id, DMSTree);

          const mappedPath = new Map();
          const parseNode = (node, parent) => {
            node.path = parent.path + "/" + node.name;
            mappedPath.set(node.path, node.id);
            node.children.forEach(child => parseNode(child, node));
          };
          parseNode(rootFolderNode, { path: "" });

          return {
            type: FILE_TYPE.FOLDER,
            name: rootFolderNode.name,
            size: files.reduce((a, b) => a + b.file?.size ?? 0, 0),
            files: files.map(file => ({
              ...file,
              parentId: mappedPath.get("/" + file.path.join("/"))
            }))
          };
        } catch (error) {
          ErrorService.handleError(
            new RuntimeError(ERRORS.FILE_STRUCTURE_CREATE_ERROR, error)
          );
          return undefined;
        }
      })
    );

    return createdFolders.filter(Boolean);
  }
}

const service = new FileService();

export default service;
