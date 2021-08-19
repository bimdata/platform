import { reactive, readonly, toRefs } from "@vue/reactivity";
import FileService from "@/services/FileService";
import { useAuth } from "@/state/auth";
import { useModels } from "@/state/models";
import {
  FileStructureHandler,
  getDescendants,
  segregate
} from "@/utils/file-structure";

const state = reactive({
  projectFileStructure: {}
});

let fileStructureHandler = new FileStructureHandler();

const loadProjectFileStructure = async project => {
  const fileStructure = await FileService.fetchFileStructure(project);
  state.projectFileStructure = fileStructure;
  fileStructureHandler.init(fileStructure);
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
  const fileStructure = fileStructureHandler.structure();
  state.projectFileStructure = fileStructure;
  return fileStructure;
};

const createFolder = async (project, folder) => {
  const newFolder = await FileService.createFolder(project, folder);
  softUpdateFileStructure("create", [newFolder]);
  return newFolder;
};

const updateFolders = async (project, folders) => {
  const newFolders = await FileService.updateFolders(project, folders);
  softUpdateFileStructure("update", folders);
  return newFolders;
};

const deleteFolders = async (project, folders) => {
  // Delete models contained in these folders
  const { softDeleteModels } = useModels();
  const modelDocs = folders
    .flatMap(folder => getDescendants(folder))
    .filter(doc => !!doc.ifcId);
  softDeleteModels(modelDocs.map(doc => ({ id: doc.ifcId })));

  await FileService.deleteFolders(project, folders);
  softUpdateFileStructure("delete", folders);

  return folders;
};

const updateDocuments = async (project, documents) => {
  const newDocuments = await FileService.updateDocuments(project, documents);
  softUpdateFileStructure("update", documents);

  // Update corresponding models if any
  const { fetchModelByID, softUpdateModels } = useModels();
  const modelDocs = documents.filter(doc => !!doc.ifcId);
  Promise.all(modelDocs.map(doc => fetchModelByID(project, doc.ifcId))).then(
    softUpdateModels
  );

  return newDocuments;
};

const deleteDocuments = async (project, documents) => {
  // Delete corresponding models if any
  const { softDeleteModels } = useModels();
  const modelDocs = documents.filter(doc => !!doc.ifcId);
  softDeleteModels(modelDocs.map(doc => ({ id: doc.ifcId })));

  await FileService.deleteDocuments(project, documents);
  softUpdateFileStructure("delete", documents);

  return documents;
};

const updateFiles = async (project, files) => {
  const { folders, documents } = segregate(files);
  const newFiles = (
    await Promise.all([
      updateFolders(project, folders),
      updateDocuments(project, documents)
    ])
  ).flat();
  return newFiles;
};

const moveFiles = async (project, files, dest) => {
  let newFiles = files.map(file => ({ ...file, parentId: dest.id }));
  const { folders, documents } = segregate(newFiles);
  newFiles = (
    await Promise.all([
      FileService.updateFolders(project, folders),
      FileService.updateDocuments(project, documents)
    ])
  ).flat();
  loadProjectFileStructure(project);
  return newFiles;
};

const deleteFiles = async (project, files) => {
  const { folders, documents } = segregate(files);
  await Promise.all([
    deleteFolders(project, folders),
    deleteDocuments(project, documents)
  ]);
  return files;
};

const getArchiveUrl = (project, files) => {
  const { accessToken } = useAuth();
  const { folders, documents } = segregate(files);
  return FileService.getArchiveUrl(
    project,
    folders,
    documents,
    accessToken.value
  );
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
    updateFolders,
    deleteFolders,
    updateDocuments,
    deleteDocuments,
    updateFiles,
    moveFiles,
    deleteFiles,
    getArchiveUrl
  };
}
