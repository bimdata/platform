import { reactive, readonly, toRefs } from "@vue/reactivity";
import FileService from "@/server/FileService";
import { FileStructureHandler } from "@/utils/file-structure";

const state = reactive({
  projectFileStructure: {}
});

let fileStructureHandler = null;

const loadProjectFileStructure = async project => {
  const fileStructure = await FileService.fetchFileStructure(project);
  state.projectFileStructure = fileStructure;
  fileStructureHandler = new FileStructureHandler(fileStructure);
  return fileStructure;
};

const softUpdateFileStructure = (action, files) => {
  for (const file of [files].flat()) {
    switch (action) {
      case "create":
        fileStructureHandler.createFile(file);
        break;
      case "update":
        fileStructureHandler.updateFile(file);
        break;
      case "delete":
        fileStructureHandler.deleteFile(file);
        break;
    }
  }
  const fileStructure = fileStructureHandler.structure();
  state.projectFileStructure = fileStructure;
  return fileStructure;
};

const createFolder = async (project, folder) => {
  const newFolder = await FileService.createFolder(project, folder);
  softUpdateFileStructure("create", newFolder);
  return newFolder;
};

const updateFolders = async (project, folders) => {
  const newFolders = await FileService.updateFolders(project, folders);
  softUpdateFileStructure("update", newFolders);
  return newFolders;
};

const deleteFolders = async (project, folders) => {
  await FileService.deleteFolders(project, folders);
  softUpdateFileStructure("delete", folders);
  return folders;
};

const createDocument = async (project, document) => {
  const newDocument = await FileService.createDocument(project, document);
  softUpdateFileStructure("create", newDocument);
  return newDocument;
};

const updateDocuments = async (project, documents) => {
  const newDocuments = await FileService.updateDocuments(project, documents);
  softUpdateFileStructure("update", newDocuments);
  return newDocuments;
};

const deleteDocuments = async (project, documents) => {
  await FileService.deleteDocuments(project, documents);
  softUpdateFileStructure("delete", documents);
  return documents;
};

export function useFiles() {
  const readOnlyState = readonly(state);
  return {
    // References
    ...toRefs(readOnlyState),
    fileStructureHandler: () => fileStructureHandler,
    // Methods
    loadProjectFileStructure,
    createFolder,
    updateFolders,
    deleteFolders,
    createDocument,
    updateDocuments,
    deleteDocuments
  };
}
