import { reactive, readonly, toRefs } from "vue";
import BcfService from "@/services/BcfService.js";

const state = reactive({
  bcfTopics: [],
  topicExtensions: [],
  topicDetailedExtensions: []
});

const loadBcfTopics = async project => {
  const topics = await BcfService.fetchProjectTopics(project);

  let topicsWithSnapshots = [];

  if (topics) {
    topicsWithSnapshots = await Promise.all(
      topics.map(async topic => {
        const viewpoints = await BcfService.fetchTopicViewpoints(
          project,
          topic,
          "url"
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

const updateTopic = async (project, bcfTopic, topic) => {
  const newTopic = await BcfService.updateProjectTopics(
    project,
    bcfTopic,
    topic
  );
  await loadBcfTopics(project);
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

const exportBcf = async project => {
  const bcf = await BcfService.exportBcf(project);
  await loadBcfTopics(project);
  return bcf;
};

const loadTopicExtensions = async project => {
  const topicExtensions = await BcfService.fetchTopicExtensions(project);
  state.topicExtensions = topicExtensions;
  return topicExtensions;
};

const loadTopicDetailedExtensions = async project => {
  const topicDetailedExtensions = await BcfService.fetchTopicDetailedExtensions(
    project
  );
  state.topicDetailedExtensions = topicDetailedExtensions;
  return topicDetailedExtensions;
};

// extension priority
const createTopicExtensionPriority = async (project, newPriority) => {
  const newTopicExtensionPriority =
    await BcfService.createTopicExtensionPriority(project, newPriority);
  await loadTopicDetailedExtensions(project);
  return newTopicExtensionPriority;
};
const deleteTopicExtensionPriority = async (project, priority) => {
  const newTopicExtensionPriority =
    await BcfService.deleteTopicExtensionPriority(project, priority);
  await loadTopicDetailedExtensions(project);
  return newTopicExtensionPriority;
};
const updateTopicExtensionPriority = async (project, id, priority) => {
  const newTopicExtensionPriority =
    await BcfService.updateTopicExtensionPriority(project, id, priority);
  await loadTopicDetailedExtensions(project);
  return newTopicExtensionPriority;
};

const updateTopicExtensions = async (project, extensions) => {
  const newTopicExtensions = await BcfService.updateTopicExtensions(
    project,
    extensions
  );
  await loadTopicExtensions(project);
  return newTopicExtensions;
};

export function useBcf() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadBcfTopics,
    createTopic,
    updateTopic,
    deleteTopic,
    importBcf,
    exportBcf,
    loadTopicExtensions,
    loadTopicDetailedExtensions,
    createTopicExtensionPriority,
    deleteTopicExtensionPriority,
    updateTopicExtensionPriority,
    updateTopicExtensions
  };
}
