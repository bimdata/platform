import { statusLimitNew, statusLimitActive } from "@/config/projects.js";
import { FILE_TYPE, STANDARD_HIDDEN_FILES } from "@/config/files.js";

// Project statuses
const NEW = "new";
const ACTIVE = "active";
const INACTIVE = "inactive";
// const PAUSED = "paused";

/**
 * Get the status of a given project.
 *
 * @param {Object} project
 * @returns {String}
 */
function projectStatus(project) {
  const today = new Date();
  const createDate = new Date(project.created_at);
  const updateDate = new Date(project.updated_at);

  const newDateLimit = new Date(today);
  newDateLimit.setDate(today.getDate() - statusLimitNew);
  const activeDateLimit = new Date(today);
  activeDateLimit.setDate(today.getDate() - statusLimitActive);

  if (createDate.getTime() > newDateLimit.getTime()) {
    return NEW;
  } else if (updateDate.getTime() > activeDateLimit.getTime()) {
    return ACTIVE;
  } else {
    return INACTIVE;
  }
}

/**
 * Get paths for each files
 *
 * @param {Array} files an array of string representing breadcrumb for each file
 * @returns {Array} an array of array filled by string representing nested folders
 */

function getPaths(files) {
  return Array.from(
    new Set(
      files.map(file =>
        JSON.stringify(file.webkitRelativePath.split("/").slice(0, -1))
      )
    ),
    JSON.parse
  ).sort((a, b) => a.length - b.length);
}
function getDocsInfos(files) {
  return files
    .map(file => ({
      file: file,
      path: file.webkitRelativePath.split("/").slice(0, -1)
    }))
    .filter(file => !STANDARD_HIDDEN_FILES.includes(file.file.name));
}

/**
 * Tree creation based
 *
 * @param {Object} folder current folder where the user is
 * @param {Array} paths an array of array filled by string representing nested folders
 *
 * since folders in paths array are not identified by IDs (unicity), if two
 * folders have the same name at the same level of nestings, they will merge.
 */

function createTreeFromPaths(folder, paths) {
  const root = paths[0]?.[0];
  if (!root) return;

  const tree = {
    name: root,
    parent_id: folder.parent_id,
    default_permission: 1,
    children: []
  };

  const shiftedPaths = paths
    .map(path => {
      const newPath = Array.from(path);
      newPath.shift();
      return newPath;
    })
    .filter(path => path.length > 0);

  shiftedPaths.forEach(path =>
    path.reduce((parentFolder, currentFolderName) => {
      let currentFolder = parentFolder.children.find(
        child => child.name === currentFolderName
      );

      if (!currentFolder) {
        currentFolder = {
          name: currentFolderName,
          default_permission: 1,
          children: []
        };
        parentFolder.children.push(currentFolder);
      }

      return currentFolder;
    }, tree)
  );

  return tree;
}

function matchFoldersAndDocs(DMSTree, docsInfos) {
  return docsInfos.map(doc => {
    const docPath = Array.from(doc.path);

    docPath.shift();
    let parentId = null;
    const parentFolder = docPath.reduce((parentFolder, currentFolderName) => {
      return (
        parentFolder.children.find(child => child.name === currentFolderName) ??
        parentFolder
      );
    }, DMSTree[0]);
    parentId = parentFolder.id;

    return {
      ...doc,
      parentId
    };
  });
}

function treeIdGenerator(projectToImport) {
  if (projectToImport.folders.length === 0) return;
  // Populate folder tree with IDs permit to satisfy a requieremet from FileTree component. Front-end use only.
  let idGenerator = 1;

  const mapping = folders => {
    return folders.map(folder => ({
      ...folder,
      id: idGenerator++,
      type: FILE_TYPE.FOLDER,
      children: folder.children?.length > 0 ? mapping(folder.children) : []
    }));
  };

  return [
    { name: projectToImport.name, children: mapping(projectToImport.folders) }
  ];
}

export {
  projectStatus,
  getPaths,
  getDocsInfos,
  createTreeFromPaths,
  matchFoldersAndDocs,
  treeIdGenerator
};
