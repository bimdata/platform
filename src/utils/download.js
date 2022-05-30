import { delay } from "./async.js";

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

async function downloadBlobAs(name, blob) {
  const { URL } = window;
  const link = document.createElement("a");
  link.rel = "noopener";
  link.download = name;
  // Create object url from blob
  link.href = URL.createObjectURL(blob);

  // Trigger "Save As" dialog
  setTimeout(() => link.click(), 0);
  // Revoke object url after 40 seconds
  setTimeout(() => URL.revokeObjectURL(link.href), 4e4);
}

export { download, downloadAll, downloadBlobAs };
