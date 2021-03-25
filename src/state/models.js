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

const updateModel = async (project, model) => {
  const newModel = await ModelService.updateModels(project, model);
  softUpdateModel(newModel);
  return newModel;
};

const softUpdateModel = model => {
  state.projectModels = state.projectModels.map(m =>
    m.id === model.id ? { ...m, ...model } : m
  );
  return model;
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
    updateModel,
    softUpdateModel,
    fetchModelSite,
    createModelSite,
    updateModelSite
  };
}
