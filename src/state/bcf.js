import mapLimit from "async/mapLimit";
import { reactive, shallowReadonly, toRefs } from "vue";
import BcfService from "@/services/BcfService.js";
import { useProjects } from "@/state/projects.js";

const state = reactive({
  bcfTopics: [],
  extensions: {
    topic_type: [],
    priority: [],
    topic_status: [],
    stage: [],
    user_id_type: [],
    topic_label: []
  },
  detailedExtensions: {
    topic_types: [],
    priorities: [],
    topic_statuses: [],
    stages: [],
    topic_labels: []
  }
});

const loadBcfTopics = async project => {
  const topics = await BcfService.fetchProjectTopics(project);
  topics.sort((a, b) => b.index - a.index);

  let mappedTopics = [];

  const { projectUsers } = useProjects();
  mappedTopics = await mapLimit(topics, 10, async topic => {
    topic.creator = projectUsers.value.find(
      u => u.email === topic.creation_author
    );
    topic.viewpoints = await BcfService.fetchTopicViewpoints(project, topic);
    return topic;
  });

  state.bcfTopics = mappedTopics;

  return mappedTopics;
};

const loadBcfTopicComments = async (project, topic) => {
  const comments = await BcfService.fetchTopicComments(project, topic);
  comments.sort((a, b) => (a.date > b.date ? -1 : 1));

  const { projectUsers } = useProjects();
  comments.forEach(c => {
    c.user = projectUsers.value.find(u => u.email === c.author);
  });

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
  const res = await BcfService.importBcf(project, file);
  await loadBcfTopics(project);
  await loadDetailedExtensions(project);
  return res;
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
