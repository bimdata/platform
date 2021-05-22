function fileExtension(fileName) {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

function formatBytes(bytes) {
  if (bytes >= 1000000000) {
    return `${Number(bytes / 1000000000).toFixed(2)} GB`;
  }
  if (bytes >= 1000000) {
    return `${Number(bytes / 1000000).toFixed(2)} MB`;
  }
  if (bytes >= 1000) {
    return `${Number(bytes / 1000).toFixed(2)} KB`;
  }
  return `${bytes} B`;
}

export { fileExtension, formatBytes };
