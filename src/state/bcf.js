import { reactive, readonly, toRefs } from "vue";
import BcfService from "@/services/BcfService.js";

const state = reactive({
  bcfTopics: []
});

const loadBcfTopics = async project => {
  const topics = await BcfService.fetchProjectTopics(project);

  const topicsWithSnapshots = await Promise.all(
    topics.map(async topic => {
      const viewpoints = await BcfService.fetchTopicViewpoints(project, topic);
      return {
        ...topic,
        snapshots: viewpoints.map(viewpoint => viewpoint.snapshot)
      };
    })
  );

  state.bcfTopics = topicsWithSnapshots;

  return topicsWithSnapshots;
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
