import { reactive, readonly, toRefs } from "@vue/reactivity";
import FileService from "@/server/FileService";

const state = reactive({
  projectFiles: [],
  projectFileStructure: {}
});

const loadProjectFiles = async project => {
  const files = await FileService.fetchDocuments(project);
  state.projectFiles = files;
  return files;
};

const loadProjectFileStructure = async project => {
  const fileStructure = await FileService.fetchFileStructure(project);
  state.projectFileStructure = fileStructure;
  return fileStructure;
};

export function useFiles() {
  const readOnlyState = readonly(state);
  return {
    ...toRefs(readOnlyState),
    loadProjectFiles,
    loadProjectFileStructure
  };
}
