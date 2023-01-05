import { reactive, readonly, toRefs } from "vue";
import FileService from "../services/FileService.js";
import { FileStructureHandler, segregate } from "../utils/file-structure.js";

import { useAuth } from "./auth.js";
import { useModels } from "./models.js";

const state = reactive({
  projectFileStructure: {}
});

let fileStructureHandler = new FileStructureHandler();

const loadProjectFileStructure = async project => {
  const fileStructure = await FileService.fetchFileStructure(project);
  state.projectFileStructure = fileStructure;
  fileStructureHandler.serialize(fileStructure);
  return fileStructure;
};

const softUpdateFileStructure = (action, files) => {
  let actionFn;
  switch (action) {
    case "create":
      actionFn = file => fileStructureHandler.createFile(file);
      break;
    case "update":
      actionFn = file => fileStructureHandler.updateFile(file);
      break;
    case "delete":
      actionFn = file => fileStructureHandler.deleteFile(file);
      break;
  }
  for (const file of files) {
    actionFn(file);
  }
  const fileStructure = fileStructureHandler.deserialize();
  state.projectFileStructure = fileStructure;
  return fileStructure;
};

const createFolder = async (project, folder) => {
  const newFolder = await FileService.createFolder(project, folder);
  await loadProjectFileStructure(project);
  return newFolder;
};

const updateFiles = async (project, files) => {
  const { folders, documents } = segregate(files);
  const newFiles = (
    await Promise.all([
      FileService.updateFolders(project, folders),
      FileService.updateDocuments(project, documents)
    ])
  ).flat();

  await loadProjectFileStructure(project);
  const { loadProjectModels } = useModels();
  await loadProjectModels(project);

  return newFiles;
};

const moveFiles = async (project, files, dest) => {
  let newFiles = files.map(file => ({ ...file, parent_id: dest.id }));

  const { folders, documents } = segregate(newFiles);
  newFiles = (
    await Promise.all([
      FileService.updateFolders(project, folders),
      FileService.updateDocuments(project, documents)
    ])
  ).flat();

  await loadProjectFileStructure(project);
  const { loadProjectModels } = useModels();
  await loadProjectModels(project);

  return newFiles;
};

const downloadFiles = async (project, files) => {
  const { accessToken } = useAuth();
  await FileService.downloadFiles(project, files, accessToken.value);
};

const deleteFiles = async (project, files) => {
  const { folders, documents } = segregate(files);
  await Promise.all([
    FileService.deleteFolders(project, folders),
    FileService.deleteDocuments(project, documents)
  ]);

  await loadProjectFileStructure(project);
  const { loadProjectModels } = useModels();
  await loadProjectModels(project);

  return files;
};

const getDocument = async (project, document) => {
  return await FileService.getDocument(project, document);
};

export function useFiles() {
  const readOnlyState = readonly(state);
  return {
    // References
    ...toRefs(readOnlyState),
    fileStructureHandler,
    // Methods
    loadProjectFileStructure,
    softUpdateFileStructure,
    createFolder,
    updateFiles,
    moveFiles,
    downloadFiles,
    getDocument,
    deleteFiles
  };
}
