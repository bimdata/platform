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

export { fileExtension, formatBytes, generateFileKey };
