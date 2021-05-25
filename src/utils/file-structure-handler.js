/* eslint-disable */

function createStructureNode(fileMap, file, parent, siblings = []) {
  return {
    id: file.id,
    name: file.name,
    data: file,
    get parent() {
      return parent ? fileMap.get(parent.id) : null;
    },
    get siblings() {
      return siblings.map(f => fileMap.get(f.id));
    },
    get children() {
      return (file.children || []).map(f => fileMap.get(f.id));
    }
  };
}

function createStructureMap(fileMap, file, parent = null) {
  const siblings = (file.children || []).filter(child =>
    child.id !== file.id
  );
  fileMap.set(
    file.id,
    createStructureNode(fileMap, file, parent, siblings)
  );
  (file.children || []).forEach(child =>
    createStructureMap(fileMap, child, file)
  );
  return fileMap;
}

class FileStructureHandler {
  constructor(structure) {
    this.files = createStructureMap(new Map(), structure);
  }

  file(id) {
    return this.files.get(id);
  }
}

export default FileStructureHandler;
