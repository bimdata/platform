import { useService } from "@bimdata/bcf-components";
import { reactive, shallowReadonly, toRefs } from "vue";
import BcfService from "../services/BcfService.js";
import { useProjects } from "./projects.js";

const service = useService();

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
  const res = await BcfService.importBcf(project, file);
  await loadExtensions(project);
  await loadDetailedExtensions(project);
  await loadBcfTopics(project);
  return res;
};

const exportBcf = (project, topics) => {
  return BcfService.exportBcf(project, topics);
};

export function useBcf() {
  const readonlyState = shallowReadonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadBcfTopics,
    loadExtensions,
    loadDetailedExtensions,
    importBcf,
    exportBcf
  };
}
