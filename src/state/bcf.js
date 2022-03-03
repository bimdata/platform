import { reactive, readonly, toRefs } from "vue";
import BcfService from "@/services/BcfService.js";

const state = reactive({
  bcfTopics: [],
  extensions: [],
  detailedExtensions: {
    topicTypes: [],
    priorities: [],
    topicStatuses: [],
    labels: [],
    stages: []
  },
  comments: []
});

const loadBcfTopics = async project => {
  const topics = await BcfService.fetchProjectTopics(project);

  let topicsWithSnapshotsAndComments = [];

  if (topics) {
    topicsWithSnapshotsAndComments = await Promise.all(
      topics.map(async topic => {
        const viewpoints = await BcfService.fetchTopicViewpoints(
          project,
          topic,
          "url"
        );
        const comments = await fetchAllComments(project, topic);
        return {
          ...topic,
          snapshots: viewpoints.map(viewpoint => viewpoint.snapshot),
          components: viewpoints.map(viewpoint => viewpoint.components),
          comments
        };
      })
    );
  }

  state.bcfTopics = topicsWithSnapshotsAndComments;

  return topicsWithSnapshotsAndComments;
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
const deleteExtension = async (project, extensionType, priority) => {
  const newExtension = await BcfService.deleteExtension(
    project,
    extensionType,
    priority
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

// comments
const fetchAllComments = async (project, topic) => {
  const comments = await BcfService.fetchAllComments(project, topic);
  state.comments = comments;
  return comments;
};
const createComment = async (project, topic, data) => {
  const newComment = await BcfService.createComment(project, topic, data);
  await fetchAllComments(project, topic);
  return newComment;
};
const deleteComment = async (project, topic, comment) => {
  const newComment = await BcfService.deleteComment(project, topic, comment);
  await fetchAllComments(project, topic);
  return newComment;
};
const updateComment = async (project, topic, id, comment) => {
  const newComment = await BcfService.updateComment(
    project,
    topic,
    id,
    comment
  );
  await fetchAllComments(project, topic);
  return newComment;
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
    loadExtensions,
    loadDetailedExtensions,
    createExtension,
    deleteExtension,
    updateExtension,
    fetchAllComments,
    createComment,
    deleteComment,
    updateComment
  };
}
