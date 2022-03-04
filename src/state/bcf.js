import { reactive, shallowReadonly, toRefs } from "vue";
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
  }
});

const loadBcfTopics = async project => {
  const topics = await BcfService.fetchProjectTopics(project);

  let topicsWithSnapshotsAndComments = [];

  topicsWithSnapshotsAndComments = await Promise.all(
    topics.map(async topic => {
      const viewpoints = await BcfService.fetchTopicViewpoints(
        project,
        topic,
        "url"
      );

      const rootComments = await fetchAllComments(project, topic);
      topic.snapshots = viewpoints.map(viewpoint => viewpoint.snapshot);
      topic.components = viewpoints.map(viewpoint => viewpoint.components);
      topic.comments = rootComments;
      return topic;
    })
  );

  state.bcfTopics = topicsWithSnapshotsAndComments;

  return topicsWithSnapshotsAndComments;
};

const createTopic = async (project, topic) => {
  const newTopic = await BcfService.createTopic(project, topic);
  await loadBcfTopics(project);
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
  await loadDetailedExtensions(project);
  return bcf;
};

const exportBcf = project => {
  return BcfService.exportBcf(project);
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
  let allComments = await BcfService.fetchAllComments(project, topic);

  const rootComments = allComments.filter(
    comment => comment.replyToCommentGuid === undefined
  );
  const replies = allComments.filter(
    comment => comment.replyToCommentGuid !== undefined
  );

  rootComments.forEach(rootComment => {
    rootComment.replies = [];
  });

  let unattachedReplies = replies;
  const genealogy = new Map();
  let maxGeneration = 100; // Set a hard limit to avoid infinite loops
  while (unattachedReplies.length > 0 && maxGeneration-- > 0) {
    unattachedReplies = unattachedReplies.reduce((acc, reply) => {
      const parent = rootComments.find(
        rootComment => rootComment.guid === reply.replyToCommentGuid
      );
      if (parent) {
        parent.replies.push(reply);
        genealogy.set(reply.guid, parent);
      } else {
        const grandParent = genealogy.get(reply.replyToCommentGuid);
        if (grandParent) {
          grandParent.replies.push(reply);
          genealogy.set(reply.guid, grandParent);
        } else {
          acc.push(reply);
        }
      }
      return acc;
    }, []);
  }

  rootComments.sort((a, b) => (a.date.getTime() > b.date.getTime() ? -1 : 1));

  rootComments.forEach(rootComment => {
    rootComment.replies.sort((a, b) =>
      a.date.getTime() > b.date.getTime() ? 1 : -1
    );
  });
  return rootComments;
};
const createComment = async (project, topic, data) => {
  const newComment = await BcfService.createComment(project, topic, data);
  topic.comments = await fetchAllComments(project, topic);
  return newComment;
};
const deleteComment = async (project, topic, comment) => {
  const newComment = await BcfService.deleteComment(project, topic, comment);
  topic.comments = await fetchAllComments(project, topic);
  return newComment;
};
const updateComment = async (project, topic, comment, data) => {
  const newComment = await BcfService.updateComment(
    project,
    topic,
    comment,
    data
  );
  topic.comments = await fetchAllComments(project, topic);
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
