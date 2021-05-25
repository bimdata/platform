function createStructureNode(files, file, parent, children = []) {
  return {
    id: file.id,
    name: file.name,
    data: file,
    get parent() {
      return parent ? files.get(parent.id) : null;
    },
    get children() {
      return (children || []).map(f => files.get(f.id));
    }
  };
}

function createStructureMap(files, file, parent) {
  files.set(file.id, createStructureNode(files, file, parent, file.children));
  (file.children || []).forEach(child =>
    createStructureMap(files, child, file)
  );
}

class FileStructureHandler {
  constructor(structure) {
    this.files = new Map();
    createStructureMap(this.files, structure, null);
  }

  file(id) {
    return this.files.get(id);
  }
}

export default FileStructureHandler;
