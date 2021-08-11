/* eslint-disable */

const FILE_TYPE = Object.freeze({
  FOLDER: "Folder",
  DOCUMENT: "Document",
  IFC: "Ifc"
});

const FILE_PERMISSION = Object.freeze({
  ACCESS_DENIED: 1,
  READ_ONLY: 50,
  READ_WRITE: 100
});

/**
 * Create a node map from file structure.
 *
 * @param {Object} fileStructure 
 * @returns {Map}
 */
function createNodeMap(fileStructure) {
  const nodeMap = new Map();
  const addToNodeMap = file => {
    nodeMap.set(
      file.id,
      createFileNode(nodeMap, file)
    );
    (file.children || []).forEach(
      child => addToNodeMap(child)
    );
  };
  addToNodeMap(fileStructure);
  return nodeMap;
}

/**
 * Create a file structure with the given root from node map.
 *
 * @param {Map} nodeMap 
 * @param {Object} root 
 * @returns {Object}
 */
function createFileStructure(nodeMap, root) {
  const rootNode = nodeMap.get(root.id);
  const addToFileStructure = node => {
    return Object.assign({}, {
      ...node.file,
      children: node.children.map(
        child => addToFileStructure(child)
      )
    });
  };
  return addToFileStructure(rootNode);
}

/**
 * Create a file node to be added to the given node map from file.
 *
 * @param {Map} nodeMap 
 * @param {Object} file 
 * @returns {Object}
 */
function createFileNode(nodeMap, file) {
  return {
    file: { ...file, children: [] },
    _children: (file.children || []).map(f => f.id),

    get parent() {
      return file.parentId ? nodeMap.get(file.parentId) : null;
    },
    get children() {
      return this._children.map(id => nodeMap.get(id));
    },

    update(file) {
      return Object.assign(this.file, { ...file, children: [] });
    },
    addChild(child) {
      this._children.push(child.id);
      return child;
    },
    removeChild(child) {
      this._children = this._children.filter(id => id !== child.id);
      return child;
    }
  };
}

class FileStructureHandler {

  constructor(fileStructure) {
    this.init(fileStructure);
  }

  init(fileStructure) {
    if (
      fileStructure
      && fileStructure.id !== undefined
      && fileStructure.id !== null
    ) {
      this.root = { id: fileStructure.id };
      this.nodeMap = createNodeMap(fileStructure);
    } else {
      // throw new Error(
      //   "[FileStructureHandler] invalid init structure."
      // );
      this.root = null;
      this.nodeMap = new Map();
    }
  }

  structure(root) {
    return createFileStructure(this.nodeMap, root || this.root);
  }

  /**********************
   * Structure accessors
   */

  exists(file) {
    return this.nodeMap.has(file.id);
  }

  get(file, options = {}) {
    const fileData = (this.nodeMap.get(file.id) || {}).file;
    return fileData && options.children 
      ? { ...fileData, children: this.children(file) }
      : fileData;
  }

  parent(file) {
    return this.get({ id: file.parentId }) || null;
    // return (this.nodeMap.get(file.id) || {}).parent.file;
  }

  children(file) {
    return (this.nodeMap.get(file.id) || {}).children.map(
      child => child.file
    );
  }

  ancestors(file) {
    const ancestors = [];
    let parent = this.parent(file);
    while (parent) {
      ancestors.unshift(parent);
      parent = this.parent(parent);
    }
    return ancestors;
  }

  descendants(file) {
    const children = this.children(file);
    return children.concat(
      children.flatMap(
        child => this.descendants(child)
      )
    );
  }

  siblings(file) {
    const parent = this.nodeMap.get(file.id).parent;
    if (!parent) {
      return [];
    }
    const siblings = [];
    for (const child of parent.children) {
      if (child.id !== file.id) {
        siblings.push(child.file);
      }
    }
    return siblings;
  }

  /**********************
   * Structure mutations
   */

  createFile(file) {
    const node = createFileNode(this.nodeMap, file);
    this.nodeMap.set(file.id, node);
    if (node.parent) {
      node.parent.addChild(file);
    }
    (file.children || []).forEach(
      child => this.createFile(child)
    );
  }

  updateFile(file) {
    const node = this.nodeMap.get(file.id);
    if (node) {
      node.update(file);
    }
  }

  deleteFile(file) {
    const node = this.nodeMap.get(file.id);
    if (node) {
      (file.children || []).forEach(
        child => this.deleteFile(child)
      );
      this.nodeMap.delete(file.id);
      if (node.parent) {
        node.parent.removeChild(file);
      }
    }
  }
}

function getDescendants(file) {
  const children = file.children || [];
  return children.concat(
    children.flatMap(
      child => getDescendants(child)
    )
  );
}

function segregate(files) {
  const folders = [];
  const documents = [];
  for (const file of files) {
    if (file.type === FILE_TYPE.FOLDER) {
      folders.push(file);
    } else {
      documents.push(file);
    }
  }
  return {
    folders,
    documents
  };
}

export {
  FILE_PERMISSION,
  FILE_TYPE,
  FileStructureHandler,
  getDescendants,
  segregate
};
