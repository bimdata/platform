function fileExtension(fileName) {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

function formatBytes(bytes) {
  if (bytes >= 1000000000000) {
    return `${Number(bytes / 1000000000000).toFixed(2)} TB`;
  }
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

function formatBytesV2(bytes, decimals = 2) {
  if (bytes) {
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return parseFloat((bytes / Math.pow(1024, i)).toFixed(dm)) + " " + sizes[i];
  } else {
    return "0 Bytes";
  }
}

function generateFileKey(fileName, fileSize) {
  let key = Math.max(fileSize, 1000);
  key = Math.random() * key + 1;
  key = `${key}-${fileName}`;
  return key;
}

export { fileExtension, formatBytes, formatBytesV2, generateFileKey };
