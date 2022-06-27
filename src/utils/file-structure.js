/* eslint-disable */
import { FILE_TYPE } from "@/config/files.js";

/**
 * Compute a file UUID.
 *
 * @param {Object} file 
 * @returns {String}
 */
function uuid(file) {
  return `${file.nature}-${file.id}`;
}

/**
 * Validate a file object.
 *
 * @param {Object} file 
 * @param {Array} requiredFields 
 */
function validate(file, requiredFields = []) {
  if (!file) {
    throw new Error(`[file validation] invalid file: ${file}`);
  }
  if (!file.id && file.id !== 0) {
    throw new Error(`[file validation] file id not set: ${file.id}`);
  }
  if (!file.nature) {
    throw new Error(`[file validation] file type not set: ${file.nature}`);
  }
  for (const field of requiredFields) {
    if (!file[field] && file[field] !== 0) {
      throw new Error(`[file validation] file ${field} not set: ${file[field]}`);
    }
  }
}

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
      uuid(file),
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
  const rootNode = nodeMap.get(uuid(root));
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
    _children: (file.children || []).map(child => uuid(child)),

    get parent() {
      return this.file.parentId ? nodeMap.get(`${FILE_TYPE.FOLDER}-${this.file.parentId}`) : null;
    },
    get children() {
      return this._children.map(nodeId => nodeMap.get(nodeId));
    },

    update(file) {
      return Object.assign(this.file, { ...file, children: [] });
    },
    addChild(child) {
      const childId = uuid(child);
      if (!this._children.includes(childId)) {
        this._children.push(childId);
      }
      return child;
    },
    removeChild(child) {
      const childId = uuid(child);
      this._children = this._children.filter(nodeId => nodeId !== childId);
      return child;
    }
  };
}

class FileStructureHandler {

  constructor(fileStructure) {
    this.root = null;
    this.nodeMap = new Map();
    if (fileStructure) {
      this.serialize(fileStructure);
    }
  }

  serialize(fileStructure) {
    validate(fileStructure);
    this.root = {
      id: fileStructure.id,
      nature: fileStructure.nature
    };
    this.nodeMap = createNodeMap(fileStructure);
  }

  deserialize(root) {
    if (!this.root) {
      throw new Error(`[FileStructureHandler.deserialize] handler root is not set.`);
    }
    return createFileStructure(this.nodeMap, root || this.root);
  }

  /**********************
   * Structure accessors
   */

  exists(file) {
    return this.nodeMap.has(uuid(file));
  }

  get(file, options = {}) {
    const fileData = (this.nodeMap.get(uuid(file)) || {}).file;
    return fileData && options.children
      ? { ...fileData, children: this.children(file) }
      : fileData;
  }

  parent(file) {
    const nodeId = uuid(file);
    const node = this.nodeMap.get(nodeId);
    if (node) {
      return (node.parent || {}).file || null;
    } else {
      throw new Error(`[FileStructureHandler.parent] node ${nodeId} does not exist.`);
    }
  }

  children(file) {
    const nodeId = uuid(file);
    const node = this.nodeMap.get(nodeId);
    if (node) {
      return node.children.map(child => child.file);
    } else {
      throw new Error(`[FileStructureHandler.children] node ${nodeId} does not exist.`);
    }
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
    const nodeId = uuid(file);
    const node = this.nodeMap.get(nodeId);
    if (node) {
      const parent = node.parent;
      if (!parent) {
        return [];
      }
      const siblings = [];
      for (const child of parent.children) {
        if (uuid(child.file) !== nodeId) {
          siblings.push(child.file);
        }
      }
      return siblings;
    } else {
      throw new Error(`[FileStructureHandler.siblings] node ${nodeId} does not exist.`);
    }
  }

  /**********************
   * Structure mutations
   */

  createFile(file) {
    validate(file, ['parentId']);
    const nodeId = uuid(file);
    const node = createFileNode(this.nodeMap, file);
    this.nodeMap.set(nodeId, node);
    node.parent.addChild(file);
    (file.children || []).forEach(
      child => this.createFile(child)
    );
  }

  updateFile(file) {
    validate(file);
    const nodeId = uuid(file);
    const node = this.nodeMap.get(nodeId);
    if (node) {
      node.update(file);
    } else {
      // throw new Error(`[FileStructureHandler.updateFile] node ${nodeId} does not exist.`);
    }
  }

  deleteFile(file) {
    validate(file);
    const nodeId = uuid(file);
    const node = this.nodeMap.get(nodeId);
    if (node) {
      (file.children || []).forEach(
        child => this.deleteFile(child)
      );
      this.nodeMap.delete(nodeId);
      if (node.parent) {
        node.parent.removeChild(file);
      }
    } else {
      // throw new Error(`[FileStructureHandler.deleteFile] node ${nodeId} does not exist.`);
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
    if (isFolder(file)) {
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

function isFolder(file) {
  return file.nature === FILE_TYPE.FOLDER;
}

function hasAdminPerm(project, file) {
  return project.isAdmin || file.userPermission === 100;
}


export {
  FileStructureHandler,
  getDescendants,
  segregate,
  isFolder,
  hasAdminPerm
};
