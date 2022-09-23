import async from "async";
import { FILE_TYPE, STANDARD_HIDDEN_FILES } from "@/config/files.js";

function fileExtension(fileName) {
  const parts = fileName.split(".");
  const extension = parts[parts.length - 1];
  return parts.length > 1 && extension ? `.${extension}` : "";
}

function formatBytes(bytes, decimals = 0) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const { floor, log, pow } = Math;

  const b = parseFloat(bytes);

  if (!b || Number.isNaN(b)) return "0 Bytes";

  const i = b < 1 ? 0 : floor(log(b) / log(1024));
  const d = decimals < 0 || i === 0 ? 0 : decimals;

  return (b / pow(1024, i)).toFixed(d) + " " + sizes[i];
}

function generateFileKey(file) {
  let key = Math.max(file.size, 1000);
  key = Math.random() * key + 1;
  key = `${key}-${file.name}`;
  return key;
}

/**
 * Get paths for each files
 *
 * @param {Array} files an array of string representing breadcrumb for each file
 * @returns {Array} an array of array filled by string representing nested folders
 */

function getPaths(files) {
  return Array.from(
    new Set(files.map(file => JSON.stringify(file.path))),
    JSON.parse
  ).sort((a, b) => a.length - b.length);
}
function handleInputFiles(files) {
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

  const pathWithoutRoot = paths
    .map(path => {
      const newPath = Array.from(path);
      newPath.shift();
      return newPath;
    })
    .filter(path => path.length > 0);

  pathWithoutRoot.forEach(path =>
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

async function getFileFormat(fileEntry) {
  return new Promise((resolve, reject) => fileEntry.file(resolve, reject));
}

async function handleDragAndDropFiles(files) {
  let fileList = [];

  async function traverseFileTree(fileEntry) {
    if (fileEntry.isFile) {
      // Get file
      return fileList.push(fileEntry);
    } else if (fileEntry.isDirectory) {
      // Get folder contents
      const dirReader = fileEntry.createReader();
      const filesEntry = await new Promise((resolve, reject) =>
        dirReader.readEntries(resolve, reject)
      );
      await async.map(filesEntry, traverseFileTree);
    }
  }

  await async.map(
    Array.from(files).map(file => file.webkitGetAsEntry()),
    traverseFileTree
  );

  return async.map(
    Array.from(fileList).filter(
      file => !STANDARD_HIDDEN_FILES.includes(file.name)
    ),
    async file => ({
      file: await getFileFormat(file),
      path: file.fullPath.split("/").slice(0, -1).filter(Boolean)
    })
  );
}

export {
  fileExtension,
  formatBytes,
  generateFileKey,
  getPaths,
  handleInputFiles,
  createTreeFromPaths,
  matchFoldersAndDocs,
  treeIdGenerator,
  handleDragAndDropFiles,
  getFileFormat
};
