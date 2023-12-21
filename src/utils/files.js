import { FILE_TYPE, STANDARD_IGNORED_FILES } from "../config/files.js";

/**
 * Get file extension from file name.
 *
 * @param {String} fileName
 * @returns {String}
 */
function fileExtension(fileName) {
  const parts = fileName.split(".");
  const extension = parts[parts.length - 1];
  return (parts.length > 1 && extension ? `.${extension}` : "").toLowerCase();
}

/**
 * Get directory path from file object.
 *
 * @param {File} file
 * @returns {String}
 */
function fileDirectory(file) {
  const filePath = file.webkitRelativePath || file._webkitRelativePath;
  return filePath?.split("/").slice(0, -1).join("/") ?? "";
}

/**
 * Get formatted file size in bytes.
 *
 * @param {Number|String} bytes
 * @param {Number} decimals
 * @returns {String}
 */
function formatBytes(bytes, decimals = 0) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const { floor, log, pow } = Math;

  const b = parseFloat(bytes);

  if (!b || Number.isNaN(b)) return "0 Bytes";

  const i = b < 1 ? 0 : floor(log(b) / log(1024));
  const d = decimals < 0 || i === 0 ? 0 : decimals;

  return (b / pow(1024, i)).toFixed(d) + " " + sizes[i];
}

/**
 * Generate a pseudo-random file key from file object.
 *
 * @param {File} file
 * @returns {String}
 */
function generateFileKey(file) {
  let key = Math.max(file.size, 1000);
  key = Math.random() * key + 1;
  key = `${key}-${file.name}`;
  return key;
}

/**
 *  Set type: FILE_TYPE.FOLDER to all folders and their children
 *
 * @param {File[]} folders
 * @returns {void}
 */
function setFolderType(folders) {
  folders.forEach(folder => {
    folder.type = FILE_TYPE.FOLDER;
    if (folder.children?.length > 0) {
      setFolderType(folder.children);
    }
  })
}

/**
 * @param {FileSystemFileEntry} entry
 * @returns {Promise<File>}
 */
async function getFileFromFileEntry(entry) {
  const file = await new Promise((resolve, reject) =>
    entry.file(resolve, reject)
  );
  if (!file.webkitRelativePath) {
    // Chrome remove path for an unknown reason
    file._webkitRelativePath = entry.fullPath?.replace("/", "");
  }
  return file;
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
 * @param {File[]} files
 * @returns {{ tree: Object, files: File[] }}
 */
function parseDirFiles(files) {
  const paths = Array.from(new Set(files.map(fileDirectory)), dirPath =>
    dirPath.split("/")
  );

  const treeFromPath = (path, node, parent) => {
    if (path.length === 0) return [];

    const name = path.shift();
    if (!name) return [];

    const children = () => [treeFromPath(path)].flat();

    if (!node) return { name, children: children() };

    if (node.name === name) {
      if (node.children.length > 0) {
        node.children.forEach(child => treeFromPath(path, child, node));
      } else {
        node.children = children();
      }
    } else {
      parent?.children.push({ name, children: children() });
    }

    return node;
  };

  const tree = paths.reduce((node, path) => treeFromPath(path, node), null);

  return { tree, files };
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
  let files = [];
  /** @type {{ tree: Object, files: File[] }[]} */
  let folders = [];

  if (event.dataTransfer) {
    // Files from drag & drop
    const asyncFiles = [];
    const asyncFolders = [];
    for (const item of event.dataTransfer.items) {
      const entry = item.webkitGetAsEntry();
      if (entry.isDirectory) {
        asyncFolders.push(parseDirEntry(entry));
      } else {
        asyncFiles.push(getFileFromFileEntry(entry));
      }
    }
    files = await Promise.all(asyncFiles);
    folders = await Promise.all(asyncFolders);
  } else {
    // Files from file input
    const inputFiles = Array.from(event.target.files);
    if (event.target.webkitdirectory) {
      const folder = parseDirFiles(inputFiles);
      folders = folder.tree ? [folder] : [];
    } else {
      files = inputFiles;
    }
  }

  // Filter ignored files
  files = files.filter(file => !STANDARD_IGNORED_FILES.includes(file.name));
  folders.forEach(folder => {
    folder.files = folder.files.filter(
      file => !STANDARD_IGNORED_FILES.includes(file.name)
    );
  });

  return { files, folders };
}

/**
 * @param {{ id: number, name: string, children: any[] }} root file structure root
 * @param {{ id: number, name: string, children: any[] }} folder files parent folder
 * @param {File[]} files
 * @returns {{ file: File, parentId: number|undefined }[]}
 */
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
  setFolderType,
};
