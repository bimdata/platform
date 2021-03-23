import { reactive, readonly, toRefs } from "vue";
import ModelService from "@/server/ModelService";

const state = reactive({
  projectModels: []
});

const loadProjectModels = async project => {
  const models = await ModelService.fetchProjectModels(project);
  state.projectModels = models;
  return models;
};

const updateModel = async (project, model) => {
  const newModel = await ModelService.updateModel(project, model);
  softUpdateModel(newModel);
  return newModel;
};

const softUpdateModel = model => {
  state.projectModels = state.projectModels.map(m =>
    m.id === model.id ? { ...m, ...model } : m
  );
  return model;
};

const fetchModelSites = async (project, model) => {
  const sites = await ModelService.fetchModelElementsByType(
    project,
    model,
    "IfcSite"
  );
  return sites;
};

const setModelSite = async (
  project,
  model,
  { address, longitude, latitude }
) => {
  const site = {
    type: "IfcSite",
    attributes: {
      type: "Attributes",
      properties: [
        {
          definition: { name: "SiteAddress" },
          value: address
        },
        {
          definition: { name: "RefLongitude" },
          value: longitude
        },
        {
          definition: { name: "RefLatitude" },
          value: latitude
        }
      ]
    }
  };
  const newSite = await ModelService.createModelElements(project, model, site);
  return newSite;
};

const updateModelSite = async (
  project,
  model,
  site,
  { address, longitude, latitude }
) => {
  const properties = [
    { name: "SiteAddress", value: address },
    { name: "RefLongitude", value: longitude },
    { name: "RefLatitude", value: latitude }
  ];
  const newProperties = await ModelService.setModelElementAttributesProperties(
    project,
    model,
    site,
    properties,
    { update: true }
  );
  return newProperties;
};

export function useModels() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    loadProjectModels,
    updateModel,
    softUpdateModel,
    fetchModelSites,
    setModelSite,
    updateModelSite
  };
}
