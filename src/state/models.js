import { reactive, readonly, toRefs } from "vue";
import ModelService from "@/server/ModelService";
import { useFiles } from "@/state/files";

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

const updateModelName = async (project, model, name) => {
  // In order to update a model name we have to update the name
  // of its assiociated document.
  const { updateDocuments } = useFiles();
  const [newDocument] = await updateDocuments(project, {
    id: model.documentId,
    ifcId: model.id,
    name
  });

  return { ...model, name, document: newDocument };
};

const softUpdateModels = models => {
  for (const model of [models].flat()) {
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
  // Delete associated documents
  const { softUpdateFileStructure } = useFiles();
  const modelDocs = [models].flat().map(model => model.document);
  softUpdateFileStructure("delete", modelDocs);

  await ModelService.deleteModels(project, models);
  softDeleteModels(models);

  return models;
};

const softDeleteModels = models => {
  const modelIDs = [models].flat().map(m => m.id);
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
  const newSite = await ModelService.createModelElements(project, model, site);
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
  const data = [
    { id: siteAddressID, name: "SiteAddress", value: address },
    { id: refLongitudeID, name: "RefLongitude", value: longitude },
    { id: refLatitudeID, name: "RefLatitude", value: latitude }
  ];
  const newProperties = await ModelService.updateModelElementAttrProperties(
    project,
    model,
    site,
    data
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
    updateModelName,
    softUpdateModels,
    mergeModels,
    deleteModels,
    softDeleteModels,
    fetchModelLocation,
    createModelLocation,
    updateModelLocation
  };
}
