import ModelService from "./ModelService";

/**
 * Mapping functions
 */

function mapElement(elem) {
  const attributes = mapPropertySet(elem.attributes);
  const propertySets = new Map();
  elem.propertySets.forEach(pset => {
    propertySets.set(pset.id, mapPropertySet(pset));
  });
  return {
    id: elem.id,
    uuid: elem.uuid,
    type: elem.type,
    attributes,
    propertySets
  };
}

function mapPropertySet(pset) {
  const properties = new Map();
  pset.properties.forEach(prop => {
    properties.set(prop.id, mapProperty(prop));
  });
  return {
    id: pset.id,
    name: pset.name,
    type: pset.type,
    properties
  };
}

function mapProperty(prop) {
  return {
    id: prop.id,
    name: prop.definition.name,
    type: prop.definition.type,
    value: prop.value
  };
}

/**
 * Model Handler
 */
class ModelHandler {
  constructor() {
    this.init();
  }

  init() {
    this.project = null;
    this.model = null;
    this.document = null;
    this.elements = new Map();
  }

  async load(project, model) {
    this.init();
    this.project = project;
    this.model = model;
    this.document = model.document;
    const elements = await ModelService.fetchModelElements(project, model);
    elements.forEach(element =>
      this.elements.set(element.uuid, mapElement(element))
    );
  }

  getElement(uuid) {
    return this.elements.get(uuid);
  }

  getAttribute({ uuid }, { id: attrID }) {
    return this.getElement(uuid).attributes.properties.get(attrID);
  }

  getProperty({ uuid }, { id: psetID }, { id: propID }) {
    return this.getElement(uuid)
      .propertySets.get(psetID)
      .properties.get(propID);
  }

  findElements(query) {
    return Array.from(this.elements.values(), elem => elem).filter(elem =>
      Object.keys(query).reduce(
        (res, queryKey) => res && elem[queryKey] === query[queryKey],
        true
      )
    );
  }

  async setElementsAttributes(query, attrs) {
    for (const elem of this.findElements(query)) {
      const attrToUpdate = [];
      const attrToCreate = [];
      for (const attr of attrs) {
        if (this.getAttribute(elem, attr)) {
          attrToUpdate.push(attr);
        } else {
          attrToCreate.push(attr);
        }
      }
      // Update attribute properties
      const updatedAttrs = await ModelService.updateModelElementAttrProperties(
        this.project,
        this.model,
        elem,
        attrToUpdate
      );
      // Create attribute properties
      const createdAttrs = await ModelService.createModelElementAttrProperties(
        this.project,
        this.model,
        elem,
        attrToCreate
      );
    }
  }

  async setElementsProperties(query, pset, props) {
    for (const elem of this.findElements(query)) {
      const propsToUpdate = [];
      const propsToCreate = [];
      for (const prop of props) {
        if (this.getProperty(elem, prop)) {
          propsToUpdate.push(prop);
        } else {
          propsToCreate.push(prop);
        }
      }
      // Update pset properties
      const updatedProps = await ModelService.updateModelElementPsetProperties(
        this.project,
        this.model,
        elem,
        pset,
        propsToUpdate
      );
      // Create pset properties
      const createdProps = await ModelService.createModelElementPsetProperties(
        this.project,
        this.model,
        elem,
        pset,
        propsToCreate
      );
    }
  }
}

export default ModelHandler;
