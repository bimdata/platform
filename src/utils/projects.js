import { statusLimitNew, statusLimitActive } from "@/config/projects.js";

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

export { projectStatus, createTreeFromPaths };
