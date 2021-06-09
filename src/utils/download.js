import { delay } from "./async";

async function download({ name, url }) {
  const link = document.createElement("a");
  link.style.display = "none";
  link.download = name;
  link.href = url;
  document.body.append(link);
  link.click();
  await delay(100);
  link.remove();
  await delay(500);
}

async function downloadAll(downloads) {
  for (const dl of downloads) {
    await download(dl);
  }
}

export { download, downloadAll };
