import eachLimit from "async/eachLimit";

import { service } from "@bimdata/bcf-components";
import { reactive, shallowReadonly, toRefs } from "vue";
import { useProjects } from "./projects.js";

const state = reactive({
  topics: [],
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
  const { projectUsers } = useProjects();
  const topics = await service.fetchTopics(project, {
    extensions: state.detailedExtensions,
    users: projectUsers.value
  });
  state.topics = topics;
  return topics;
};

const loadExtensions = async project => {
  const extensions = await service.fetchExtensions(project);
  state.extensions = extensions;
  return extensions;
};

const loadDetailedExtensions = async project => {
  const extensions = await service.fetchDetailedExtensions(project);
  state.detailedExtensions = extensions;
  return extensions;
};

const importBcf = async (project, file) => {
  const res = await service.importBcf(project, file);
  await loadExtensions(project);
  await loadDetailedExtensions(project);
  await loadBcfTopics(project);
  return res;
};

const deleteTopics = async (project, topics) => {
  const res = await eachLimit(topics, 10, async topic =>
    service.deleteTopic(project, topic)
  );
  await loadBcfTopics(project);
  return res;
};

const exportBcf = (project, topics) => {
  return service.exportBcf(project, topics);
};

const exportBcfXlsx = (project, topics, lang) => {
  return service.exportBcfXLSX(project, topics, lang);
};

export function useBcf() {
  const readonlyState = shallowReadonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    deleteTopics,
    loadBcfTopics,
    loadExtensions,
    loadDetailedExtensions,
    importBcf,
    exportBcf,
    exportBcfXlsx
  };
}
