import { statusLimitNew, statusLimitActive } from "@/config/projects.js";
import UploadService from "@/services/UploadService.js";

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

function getFilesInfos(project, files) {
  return files.map(file => ({
    name: file.name,
    path: file.webkitRelativePath.split("/").slice(0, -1),
    upload: async parentId => {
      await UploadService.createDocument(project, {
        parent_id: parentId,
        file
      });
    }
  }));
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

function uploadFilesFromDMSTree(DMSTree, filesInfos) {
  filesInfos.forEach(async file => {
    const filePath = Array.from(file.path);

    filePath.shift();
    let parentFolderID = null;
    try {
      const parentFolder = filePath.reduce(
        (parentFolder, currentFolderName) => {
          return (
            parentFolder.children.find(
              child => child.name === currentFolderName
            ) ?? parentFolder
          );
        },
        DMSTree[0]
      );
      parentFolderID = parentFolder.id;
    } catch (error) {
      console.warn("current file has not find a parent folder");
    }
    if (parentFolderID === null) return;

    try {
      await file.upload(parentFolderID);
    } catch (error) {
      console.warn(error, "internal error");
    }
  });
}

export {
  projectStatus,
  getPaths,
  getFilesInfos,
  createTreeFromPaths,
  uploadFilesFromDMSTree
};
