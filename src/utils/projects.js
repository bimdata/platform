import { statusLimitNew, statusLimitActive } from "@/config/projects.js";
import { FILE_TYPE } from "@/config/files.js";

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

export { projectStatus, treeIdGenerator };
