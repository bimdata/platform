function fileExtension(fileName) {
  const parts = fileName.split(".");
  const extension = parts[parts.length - 1];
  return parts.length > 1 && extension ? `.${extension}` : "";
}

function formatBytes(bytes, decimals = 2) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const { floor, log, pow } = Math;

  const b = parseFloat(bytes);

  if (!b || Number.isNaN(b)) return "0 Bytes";

  const d = decimals < 0 ? 0 : decimals;
  const i = b < 1 ? 0 : floor(log(b) / log(1024));

  return (b / pow(1024, i)).toFixed(d) + " " + sizes[i];
}

function generateFileKey(fileName, fileSize) {
  let key = Math.max(fileSize, 1000);
  key = Math.random() * key + 1;
  key = `${key}-${fileName}`;
  return key;
}

export { fileExtension, formatBytes, generateFileKey };
