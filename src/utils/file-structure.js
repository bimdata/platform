/* eslint-disable */

// TODO: fix me
// This function will always return an empty array because `file` does not have a `parent` property.
function getAncestors(file) {
  if (!file.parent) {
    return [];
  }
  return [file.parent].concat(
    getAncestors(file.parent)
  );
}

function getDescendants(file) {
  const children = file.children || [];
  return children.concat(
    children.flatMap(
      child => getDescendants(child)
    )
  );
}

function createStructureNode(fileMap, file, parent) {
  const siblings = parent ? (parent.children || []).filter(f => f.id !== file.id) : [];
  const children = (file.children || []);
  const ancestors = getAncestors(file);
  const descendants = getDescendants(file);

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
      return children.map(f => fileMap.get(f.id));
    },
    get ancestors() {
      return ancestors.map(f => fileMap.get(f.id));
    },
    get descendants() {
      return descendants.map(f => fileMap.get(f.id));
    }
  };
}

function createStructureMap(fileMap, file, parent = null) {
  const children = file.children || [];
  fileMap.set(
    file.id,
    createStructureNode(fileMap, file, parent)
  );
  children.forEach(child =>
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

export {
  // getAncestors,
  getDescendants,
  FileStructureHandler
};
