import { FILE_TYPE, STANDARD_IGNORED_FILES } from "../config/files.js";

function fileExtension(fileName) {
  const parts = fileName.split(".");
  const extension = parts[parts.length - 1];
  return parts.length > 1 && extension ? `.${extension}` : "";
}

function fileDirectory(file) {
  return file.webkitRelativePath?.split("/").slice(0, -1).join("/") ?? "";
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

function treeIdGenerator(projectToImport) {
  if (projectToImport.folders.length === 0) return;
  // Populate folder tree with IDs permit to satisfy a requirement from FileTree component. Front-end use only.
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

/**
 * @param {FileSystemFileEntry} entry
 * @returns {Promise<File>}
 */
function getFileFromFileEntry(entry) {
  return new Promise((resolve, reject) => entry.file(resolve, reject));
}

/**
 * @param {FileSystemDirectoryEntry} entry
 * @returns {Promise<FileSystemEntry[]>}
 */
function getEntriesFromDirEntry(entry) {
  return new Promise((resolve, reject) =>
    entry.createReader().readEntries(resolve, reject)
  );
}

/**
 * @param {FileSystemEntry} entry
 * @param {Object} tree
 * @param {File[]} files
 * @returns {{ tree: Object, files: File[] }}
 */
async function parseDirEntry(entry, tree = {}, files = []) {
  if (entry.isDirectory) {
    const childEntries = await getEntriesFromDirEntry(entry);
    const children = await Promise.all(
      childEntries.map(e => parseDirEntry(e, {}, files).then(res => res.tree))
    );
    Object.assign(tree, {
      name: entry.name,
      children: children.filter(child => child.name)
    });
  } else {
    files.push(await getFileFromFileEntry(entry));
  }
  return { tree, files };
}

/**
 * @param {InputEvent} event
 * @returns {{ files: File[], folders: { tree: Object, files: File[] }[] }}
 */
async function getFilesFromEvent(event) {
  /** @type {File[]} */
  let files;
  /** @type {{ tree: Object, files: File[] }[]} */
  let folders;

  const fileEntries = [];
  const dirEntries = [];

  if (event.dataTransfer) {
    // Files from drag & drop
    Array.from(event.dataTransfer.items, it => it.webkitGetAsEntry()).forEach(
      e => (e.isDirectory ? dirEntries : fileEntries).push(e)
    );
  } else {
    // Files from file input
    files = Array.from(event.target.files);
    if (files[0]?.webkitRelativePath) {
      dirEntries.push(files[0]);
      files = [];
    }
  }

  const asyncFiles = fileEntries.map(getFileFromFileEntry);
  files = (files ?? []).concat(await Promise.all(asyncFiles));
  files = files.filter(file => !STANDARD_IGNORED_FILES.includes(file.name));

  const asyncFolders = dirEntries.map(e => parseDirEntry(e));
  folders = await Promise.all(asyncFolders);
  folders.forEach(
    folder =>
      (folder.files = folder.files.filter(
        file => !STANDARD_IGNORED_FILES.includes(file.name)
      ))
  );

  return { files, folders };
}

function getFilesWithParentIds(root, folder, files) {
  // Create a 'dir path => file list' mapping
  const filesMap = new Map();
  for (const file of files) {
    const dir = fileDirectory(file);
    if (!filesMap.has(dir)) filesMap.set(dir, []);
    filesMap.get(dir).push({ file });
  }

  // Find the tree folder node
  const findNode = (node, id) => {
    if (node.id === id) {
      return node;
    } else {
      for (const child of node.children ?? []) {
        const res = findNode(child, id);
        if (res) return res;
      }
    }
  };
  const parent = findNode(root, folder.id);

  // Set parent ids recursively
  const setParentIds = (path, node) => {
    filesMap.get(path)?.forEach(f => (f.parentId = node.id));
    node.children?.forEach(c => setParentIds(`${path}/${c.name}`, c));
  };
  setParentIds(parent.name, parent);

  return [...filesMap.values()].flat();
}

export {
  fileExtension,
  formatBytes,
  generateFileKey,
  getFilesFromEvent,
  getFilesWithParentIds,
  treeIdGenerator
};
