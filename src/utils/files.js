function formatBytes(bytes) {
  if (bytes / 1000000 >= 1) {
    return `${Number(bytes / 1000000).toFixed(2)} MB`;
  }
  if (bytes / 1000 >= 1) {
    return `${Number(bytes / 1000).toFixed(2)} KB`;
  }
  return `${bytes} B`;
}

export { formatBytes };
