function formatBytes(bytes, decimals = 2) {
  if (bytes) {
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return parseFloat((bytes / Math.pow(1024, i)).toFixed(dm)) + " " + sizes[i];
  } else {
    return "0 Bytes";
  }
}

export { formatBytes };
