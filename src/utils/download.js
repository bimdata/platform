import { delay } from "./async.js";

async function download({ name, url }) {
  const link = document.createElement("a");
  link.style.display = "none";
  link.download = name;
  link.href = url;
  link.target = "_blank";
  document.body.append(link);
  link.click();
  await delay(100);
  link.remove();
  await delay(500);
}

export { download };
