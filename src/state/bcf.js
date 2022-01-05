import { reactive, readonly, toRefs } from "vue";
import BcfService from "@/services/BcfService.js";
import { mapProjects } from "@/state/mappers.js";

const state = reactive({
  bcfTopics: []
});

const loadBcfTopics = async project => {
  const topics = await BcfService.fetchProjectTopics(project);
  state.bcfTopics = mapProjects(topics);
  return topics;
};

export function useBcf() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadBcfTopics
  };
}
