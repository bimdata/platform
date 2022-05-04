import mapLimit from "async/mapLimit";
import { reactive, shallowReadonly, toRefs } from "vue";
import BcfService from "@/services/BcfService.js";

const state = reactive({
  bcfTopics: [],
  extensions: {
    topicType: [],
    priority: [],
    topicStatus: [],
    stage: [],
    userIdType: [],
    topicLabel: []
  },
  detailedExtensions: {
    topicTypes: [],
    priorities: [],
    topicStatuses: [],
    stages: [],
    topicLabels: []
  }
});

const loadBcfTopics = async project => {
  const topics = await BcfService.fetchProjectTopics(project);

  let topicsWithViewpoints = [];

  topicsWithViewpoints = await mapLimit(topics, 10, async topic => {
    topic.viewpoints = await BcfService.fetchTopicViewpoints(
      project,
      topic,
      "url"
    );
    return topic;
  });

  state.bcfTopics = topicsWithViewpoints;

  return topicsWithViewpoints;
};

const loadBcfTopicComments = async (project, topic) => {
  const comments = await BcfService.fetchTopicComments(project, topic);
  comments.sort((a, b) => (a.date.getTime() > b.date.getTime() ? -1 : 1));
  topic.comments = comments;
  return comments;
};

const loadExtensions = async project => {
  const extensions = await BcfService.fetchExtensions(project);
  state.extensions = extensions;
  return extensions;
};

const loadDetailedExtensions = async project => {
  const detailedExtensions = await BcfService.fetchDetailedExtensions(project);
  state.detailedExtensions = detailedExtensions;
  return detailedExtensions;
};

const importBcf = async (project, file) => {
  const bcf = await BcfService.importBcf(project, file);
  await loadBcfTopics(project);
  await loadDetailedExtensions(project);
  return bcf;
};

const exportBcf = project => {
  return BcfService.exportBcf(project);
};

export function useBcf() {
  const readonlyState = shallowReadonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadBcfTopics,
    loadBcfTopicComments,
    loadExtensions,
    loadDetailedExtensions,
    importBcf,
    exportBcf
  };
}
