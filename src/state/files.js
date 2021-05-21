import { reactive, readonly, toRefs } from "@vue/reactivity";
import FileService from "@/server/FileService";

const state = reactive({
  projectFileStructure: {},
  projectFiles: []
});

const loadProjectFileStructure = async project => {
  const fileStructure = await FileService.fetchFileStructure(project);
  state.projectFileStructure = fileStructure;
  return fileStructure;
};

const loadProjectFiles = async project => {
  const files = await FileService.fetchDocuments(project);
  state.projectFiles = files;
  return files;
};

export function useFiles() {
  const readOnlyState = readonly(state);
  return {
    ...toRefs(readOnlyState),
    loadProjectFileStructure,
    loadProjectFiles
  };
}
