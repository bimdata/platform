import eachLimit from "async/eachLimit";
import { reactive, readonly, toRefs } from "vue";
import ModelService from "../services/ModelService.js";

import { useFiles } from "./files.js";

const state = reactive({
  projectModels: []
});

const loadProjectModels = async (project, options) => {
  const models = await ModelService.fetchModels(project, options);
  const projectModels = [];
  for (const model of models) {
    if (model.id === project.main_model_id) {
      projectModels.unshift(model);
    } else {
      projectModels.push(model);
    }
  }
  state.projectModels = projectModels;
  return models;
};

const fetchModelByID = (project, id) => ModelService.fetchModelByID(project, id);

const createModel = (project, file) => ModelService.createModel(project, file);

const createPhotosphere = (project, file) => ModelService.createPhotosphere(project, file);

const mergeModels = (project, models, name) => ModelService.mergeModels(project, models, name);

const updateModels = async (project, models) => {
  const newModels = await ModelService.updateModels(project, models);
  await loadProjectModels(project);
  return newModels;
};

const updateModelName = async (project, model, name) => {
  // In order to update a model name we have to update the name of its assiociated document.
  const { updateFiles } = useFiles();
  await updateFiles(project, [{ id: model.document_id, name }]);

  return { ...model, name };
};

const deleteModels = async (project, models, options) => {
  await ModelService.deleteModels(project, models, options);

  await loadProjectModels(project);
  const { loadProjectFileStructure } = useFiles();
  await loadProjectFileStructure(project);

  return models;
};

const softDeleteModels = models => {
  const modelIDs = models.map(m => m.id);
  state.projectModels = state.projectModels.filter(
    model => !modelIDs.includes(model.id)
  );
  return models;
};

const fetchModelLocation = async (project, model) => {
  const [site] = await ModelService.fetchModelElementsByType(
    project,
    model,
    "IfcSite"
  );
  let siteAddressValue, refLongitudeValue, refLatitudeValue;
  if (site && site.attributes) {
    // Extract SiteAddress, RefLongitude and RefLatitude values from model site attributes.
    const { properties } = site.attributes;
    const prop = name => properties.find(p => p.definition.name === name);
    siteAddressValue = prop("SiteAddress")?.value;
    refLongitudeValue = prop("RefLongitude")?.value;
    refLatitudeValue = prop("RefLatitude")?.value;
  }
  return {
    site,
    address: siteAddressValue,
    longitude: refLongitudeValue,
    latitude: refLatitudeValue
  };
};

const createModelLocation = async (
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
  const newSite = await ModelService.createModelElements(project, model, [
    site
  ]);
  return newSite;
};

const updateModelLocation = async (
  project,
  model,
  { site, address, longitude, latitude }
) => {
  let siteAddressID, refLongitudeID, refLatitudeID;

  // Extract SiteAddress, RefLongitude and RefLatitude IDs from model site attributes.
  const { properties } = site.attributes;
  const prop = name => properties.find(p => p.definition.name === name);
  siteAddressID = prop("SiteAddress")?.id;
  refLongitudeID = prop("RefLongitude")?.id;
  refLatitudeID = prop("RefLatitude")?.id;

  const props = [
    { id: siteAddressID, name: "SiteAddress", value: address },
    { id: refLongitudeID, name: "RefLongitude", value: longitude },
    { id: refLatitudeID, name: "RefLatitude", value: latitude }
  ];
  const newProperties = await ModelService.updateModelElementAttrProperties(
    project,
    model,
    site,
    props
  );
  return newProperties;
};

const updateProjectModelsLocation = (project, location) => {
  return eachLimit(
    state.projectModels,
    5,
    async model => {
      const [site] = await ModelService.fetchModelElementsByType(
        project,
        model,
        "IfcSite"
      );
      if (site) {
        await updateModelLocation(project, model, { ...location, site });
      } else {
        await createModelLocation(project, model, location);
      }
    }
  );
};

export function useModels() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadProjectModels,
    fetchModelByID,
    createModel,
    createPhotosphere,
    updateModels,
    updateModelName,
    mergeModels,
    deleteModels,
    softDeleteModels,
    fetchModelLocation,
    createModelLocation,
    updateModelLocation,
    updateProjectModelsLocation,
  };
}
