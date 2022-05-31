import { reactive, readonly, toRefs } from "vue";
import ModelService from "@/services/ModelService.js";
import { useFiles } from "@/state/files.js";

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

const createModel = async (project, file) => {
  const newModel = await ModelService.createModel(project, file);
  return newModel;
};

const updateModels = async (project, models) => {
  const newModels = await ModelService.updateModels(project, models);
  await loadProjectModels(project);
  return newModels;
};

const updateModelName = async (project, model, name) => {
  // In order to update a model name we have to update the name
  // of its assiociated document.
  const { updateFiles } = useFiles();
  const [newDocument] = await updateFiles(project, [
    { ...model.document, name }
  ]);

  return { ...model, name, document: newDocument };
};

const mergeModels = async (project, models, name) => {
  await ModelService.mergeModels(project, models, name);
};

const downloadModels = async models => {
  await ModelService.downloadModels(models);
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
    // Extract SiteAddress, RefLongitude and RefLatitude
    // values from model site attributes.
    const { properties } = site.attributes;
    siteAddressValue = (
      properties.find(p => p.definition.name === "SiteAddress") || {}
    ).value;
    refLongitudeValue = (
      properties.find(p => p.definition.name === "RefLongitude") || {}
    ).value;
    refLatitudeValue = (
      properties.find(p => p.definition.name === "RefLatitude") || {}
    ).value;
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
  // Extract SiteAddress, RefLongitude and RefLatitude
  // IDs from model site attributes.
  const { properties } = site.attributes;
  siteAddressID = (
    properties.find(p => p.definition.name === "SiteAddress") || {}
  ).id;
  refLongitudeID = (
    properties.find(p => p.definition.name === "RefLongitude") || {}
  ).id;
  refLatitudeID = (
    properties.find(p => p.definition.name === "RefLatitude") || {}
  ).id;
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

export function useModels() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadProjectModels,
    fetchModelByID,
    createModel,
    updateModels,
    updateModelName,
    mergeModels,
    downloadModels,
    deleteModels,
    softDeleteModels,
    fetchModelLocation,
    createModelLocation,
    updateModelLocation
  };
}
