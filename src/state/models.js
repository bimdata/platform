import { reactive, readonly, toRefs } from "vue";
import ModelService from "@/server/ModelService";

const state = reactive({
  projectModels: []
});

const loadProjectModels = async project => {
  const models = await ModelService.fetchModels(project);
  state.projectModels = models;
  return models;
};

const fetchModelByID = async (project, id) => {
  const model = await ModelService.fetchModelByID(project, id);
  return model;
};

const updateModels = async (project, models) => {
  const newModels = await ModelService.updateModels(project, models);
  softUpdateModels(newModels);
  return newModels;
};

const softUpdateModels = models => {
  for (const model of [].concat(models)) {
    state.projectModels = state.projectModels.map(m =>
      m.id === model.id ? { ...m, ...model } : m
    );
  }
  return models;
};

const mergeModels = async (project, models, name) => {
  await ModelService.mergeModels(project, models, name);
};

const deleteModels = async (project, models) => {
  await ModelService.deleteModels(project, models);
  softDeleteModels(models);
  return models;
};

const softDeleteModels = models => {
  const modelIDs = [].concat(models).map(m => m.id);
  state.projectModels = state.projectModels.filter(
    model => !modelIDs.includes(model.id)
  );
  return models;
};

const fetchModelSite = async (project, model) => {
  const [site] = await ModelService.fetchModelElementsByType(
    project,
    model,
    "IfcSite"
  );
  if (site && site.attributes) {
    // Extract SiteAddress, RefLongitude and RefLatitude
    // from model site attributes.
    const {
      attributes: { properties }
    } = site;
    var siteAddress = (
      properties.find(p => p.definition.name === "SiteAddress") || {}
    ).value;
    var refLongitude = (
      properties.find(p => p.definition.name === "RefLongitude") || {}
    ).value;
    var refLatitude = (
      properties.find(p => p.definition.name === "RefLatitude") || {}
    ).value;
  }
  return {
    site,
    address: siteAddress,
    longitude: refLongitude,
    latitude: refLatitude
  };
};

const createModelSite = async (
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
    { id: undefined, name: "SiteAddress", value: address },
    { id: undefined, name: "RefLongitude", value: longitude },
    { id: undefined, name: "RefLatitude", value: latitude }
  ];
  const newProperties = await ModelService.updateModelElementAttrProperties(
    project,
    model,
    site,
    properties
  );
  return newProperties;
};

export function useModels() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    loadProjectModels,
    fetchModelByID,
    updateModels,
    softUpdateModels,
    mergeModels,
    deleteModels,
    softDeleteModels,
    fetchModelSite,
    createModelSite,
    updateModelSite
  };
}
