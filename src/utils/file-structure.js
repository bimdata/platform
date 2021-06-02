/* eslint-disable */

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
      return Object.assign(this.file, { ...file });
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
    this.root = { id: fileStructure.id };
    this.nodeMap = createNodeMap(fileStructure);
  }

  structure() {
    return createFileStructure(this.nodeMap, this.root);
  }

  /**********************
   * Structure accessors
   */

  get(file, options = {}) {
    const fileData = (this.nodeMap.get(file.id) || {}).file;
    return fileData && options.children 
      ? { ...fileData, children: this.children(file) }
      : fileData;
  }

  parent(file) {
    return this.get({ id: file.parentId })
  }

  children(file) {
    return this.nodeMap.get(file.id).children.map(
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

  exists(file) {
    return this.nodeMap.has(file.id);
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

  moveFile(file, target) {
    const node = this.nodeMap.get(file.id);
    const targetNode = this.nodeMap.get(target.id);
    if (node && node.parent && targetNode) {
      node.parent.removeChild(file);
      targetNode.addChild(file);
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

export {
  getDescendants,
  FileStructureHandler
};
