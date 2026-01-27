import { isFolder } from "./file-structure.js";

export const collectDescendants = (folder, predicate) => {
  const result = [];

  folder.children.forEach((child) => {
    if (predicate(child)) {
      result.push(child);
    }

    if (isFolder(child)) {
      result.push(...collectDescendants(child, predicate));
    }
  });

  return result;
};
