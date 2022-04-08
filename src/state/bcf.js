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

// --- BCF Topics ---

const loadBcfTopics = async project => {
  const topics = await BcfService.fetchProjectTopics(project);

  let topicsWithSnapshotsAndComments = [];

  topicsWithSnapshotsAndComments = await mapLimit(topics, 10, async topic => {
    const viewpoints = await BcfService.fetchTopicViewpoints(
      project,
      topic,
      "url"
    );

    topic.viewpoints = viewpoints;
    return topic;
  });

  state.bcfTopics = topicsWithSnapshotsAndComments;

  return topicsWithSnapshotsAndComments;
};

const createTopic = async (project, topic) => {
  const newTopic = await BcfService.createTopic(project, topic);
  await loadBcfTopics(project);
  return newTopic;
};

const createFullTopic = async (project, topic) => {
  const newTopic = await BcfService.createFullTopic(project, topic);
  await loadBcfTopics(project);
  return newTopic;
};

const updateTopic = async (project, bcfTopic, topic) => {
  const newTopic = await BcfService.updateFullTopic(project, bcfTopic, topic);
  await loadBcfTopics(project);
  return newTopic;
};

const deleteTopic = async (project, topic) => {
  await BcfService.deleteTopic(project, topic);
  await loadBcfTopics(project);
  return topic;
};

const createViewpoint = async (project, topic, viewpoint) => {
  const newViewpoint = await BcfService.createViewpoint(
    project,
    topic,
    viewpoint
  );
  await loadBcfTopics(project);
  return newViewpoint;
};

const deleteViewpoint = (project, topic, viewpoint) => {
  return BcfService.deleteViewpoint(project, topic, viewpoint);
  // We don't want to reload topic here because this method may be called many times in parallel
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

// --- BCF Extensions ---

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

const createExtension = async (project, extensionType, data) => {
  const newExtension = await BcfService.createExtension(
    project,
    extensionType,
    data
  );
  await loadDetailedExtensions(project);
  return newExtension;
};

const updateExtension = async (project, extensionType, id, priority) => {
  const newExtension = await BcfService.updateExtension(
    project,
    extensionType,
    id,
    priority
  );
  await loadDetailedExtensions(project);
  return newExtension;
};

const deleteExtension = async (project, extensionType, priority) => {
  const newExtension = await BcfService.deleteExtension(
    project,
    extensionType,
    priority
  );
  await loadDetailedExtensions(project);
  return newExtension;
};

// --- BCF Topic Comments ---

const loadTopicComments = async (project, topic) => {
  let allComments = await BcfService.fetchAllComments(project, topic);
  allComments.sort((a, b) => (a.date.getTime() > b.date.getTime() ? -1 : 1));
  topic.comments = allComments;
  return allComments;
};

const createComment = async (project, topic, data) => {
  const newComment = await BcfService.createComment(project, topic, data);
  await loadTopicComments(project, topic);
  return newComment;
};

const deleteComment = async (project, topic, comment) => {
  const newComment = await BcfService.deleteComment(project, topic, comment);
  await loadTopicComments(project, topic);
  return newComment;
};

const updateComment = async (project, topic, comment, data) => {
  const newComment = await BcfService.updateComment(
    project,
    topic,
    comment,
    data
  );
  await loadTopicComments(project, topic);
  return newComment;
};

export function useBcf() {
  const readonlyState = shallowReadonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadBcfTopics,
    createTopic,
    createFullTopic,
    updateTopic,
    deleteTopic,
    createViewpoint,
    deleteViewpoint,
    importBcf,
    exportBcf,
    loadExtensions,
    loadDetailedExtensions,
    createExtension,
    updateExtension,
    deleteExtension,
    loadTopicComments,
    createComment,
    updateComment,
    deleteComment
  };
}
