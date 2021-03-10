import { reactive, readonly, toRefs } from "vue";
import ModelService from "@/server/IfcService";

const state = reactive({
  projectModels: []
});

const loadProjectModels = async project => {
  state.projectModels = await ModelService.fetchProjectIfcs(project);
  return state.projectModels;
};

export function useModels() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    loadProjectModels
  };
}
