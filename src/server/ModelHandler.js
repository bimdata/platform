class ModelHandler {
  constructor() {
    this.model = null;
    this.document = null;
    this.elements = new Map();
  }

  async load(model) {
    this.model = model;
    this.document = model.document;
    // TODO: fetch model elements
  }
}

export default ModelHandler;
