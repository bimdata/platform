import { reactive, readonly, toRefs } from "@vue/reactivity";
import FileService from "@/server/FileService";
import { useModels } from "@/state/models";
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
  softUpdateFileStructure("update", folders);
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
  softUpdateFileStructure("update", documents);

  // Update corresponding models if any
  const { fetchModelByID, softUpdateModels } = useModels();
  const modelDocs = [documents].flat().filter(doc => doc.type === "Ifc");
  Promise.all(modelDocs.map(doc => fetchModelByID(project, doc.ifcId))).then(
    softUpdateModels
  );

  return newDocuments;
};

const deleteDocuments = async (project, documents) => {
  await FileService.deleteDocuments(project, documents);
  softUpdateFileStructure("delete", documents);

  // Delete corresponding models if any
  const { softDeleteModels } = useModels();
  const modelDocs = [documents].flat().filter(doc => doc.type === "Ifc");
  softDeleteModels(modelDocs.map(doc => ({ id: doc.ifcId })));

  return documents;
};

const updateFile = async (project, file) => {
  if (file.type === "Folder") {
    return updateFolders(project, file);
  } else {
    return updateDocuments(project, file);
  }
};

const updateFiles = async (project, files) => {
  for (const file of [files].flat()) {
    await updateFile(project, file);
  }
  return files;
};

const deleteFile = async (project, file) => {
  if (file.type === "Folder") {
    return deleteFolders(project, file);
  } else {
    return deleteDocuments(project, file);
  }
};

const deleteFiles = async (project, files) => {
  const folders = [];
  const documents = [];
  for (const file of [files].flat()) {
    if (file.type === "Folder") {
      folders.push(file);
    } else {
      documents.push(file);
    }
  }
  await Promise.all([
    deleteFolders(project, folders),
    deleteDocuments(project, documents)
  ]);
  return files;
};

export function useFiles() {
  const readOnlyState = readonly(state);
  return {
    // References
    ...toRefs(readOnlyState),
    fileStructureHandler: () => fileStructureHandler,
    // Methods
    loadProjectFileStructure,
    softUpdateFileStructure,
    createFolder,
    updateFolder: updateFolders,
    updateFolders,
    deleteFolders,
    createDocument,
    updateDocument: updateDocuments,
    updateDocuments,
    deleteDocuments,
    updateFile,
    updateFiles,
    deleteFile,
    deleteFiles
  };
}
