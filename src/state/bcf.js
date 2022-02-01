import { reactive, readonly, toRefs } from "vue";
import BcfService from "@/services/BcfService.js";

const state = reactive({
  bcfTopics: [],
  topicExtensions: []
});

const loadBcfTopics = async project => {
  const topics = await BcfService.fetchProjectTopics(project);

  let topicsWithSnapshots = [];

  if (topics) {
    topicsWithSnapshots = await Promise.all(
      topics.map(async topic => {
        const viewpoints = await BcfService.fetchTopicViewpoints(
          project,
          topic
        );
        return {
          ...topic,
          snapshots: viewpoints.map(viewpoint => viewpoint.snapshot),
          components: viewpoints.map(viewpoint => viewpoint.components)
        };
      })
    );
  }

  state.bcfTopics = topicsWithSnapshots;

  return topicsWithSnapshots;
};

const createTopic = async (project, topic) => {
  const newTopic = await BcfService.createTopic(project, topic);
  state.bcfTopics = [newTopic].concat(state.bcfTopics);
  return newTopic;
};

const deleteTopic = async (project, topic) => {
  await BcfService.deleteTopic(project, topic);
  await loadBcfTopics(project);
  return topic;
};

const importBcf = async (project, file) => {
  const bcf = await BcfService.importBcf(project, file);
  await loadBcfTopics(project);
  return bcf;
};

const loadTopicExtensions = async project => {
  const topicExtensions = await BcfService.fetchTopicExtensions(project);
  state.topicExtensions = topicExtensions;
  return topicExtensions;
};

export function useBcf() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadBcfTopics,
    createTopic,
    deleteTopic,
    loadTopicExtensions
  };
}
