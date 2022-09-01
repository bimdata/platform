/**
 * @param {Object} param0
 * @param {Object} param1
 * @returns {Object} file uploader
 */
function createFileUploader(
  { method, url, accessToken },
  {
    onUploadStart = () => {},
    onUploadProgress = () => {},
    onUploadComplete = () => {},
    onUploadError = () => {},
    onUploadCancel = () => {}
  }
) {
  let lastUploadId = 0;

  const fileUploader = {
    request: null,
    upload(data) {
      if (!(data instanceof FormData)) {
        console.error(
          "[File Uploader] Error: 'data' argument is not an instance of FormData."
        );
        return;
      }

      const uploadId = lastUploadId++;
      const request = new XMLHttpRequest();

      request.upload.addEventListener("loadstart", e => {
        onUploadStart({
          id: uploadId,
          bytesUploaded: e.loaded,
          bytesTotal: e.total,
          percentage: (e.loaded / e.total) * 100
        });
      });
      request.upload.addEventListener("progress", e => {
        onUploadProgress({
          id: uploadId,
          bytesUploaded: e.loaded,
          bytesTotal: e.total,
          percentage: (e.loaded / e.total) * 100
        });
      });
      request.addEventListener("load", e => {
        onUploadComplete({
          id: uploadId,
          bytesUploaded: e.loaded,
          bytesTotal: e.total,
          percentage: (e.loaded / e.total) * 100,
          response: request.response
        });
        this.request = null;
      });
      request.upload.addEventListener("error", e => {
        onUploadError(e);
        this.request = null;
      });
      request.upload.addEventListener("abort", e => {
        onUploadCancel(e);
        this.request = null;
      });
      request.addEventListener("readystatechange", e => {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status >= 400) {
            onUploadError(e);
            this.request = null;
          }
        }
      });

      request.open(method, url);
      request.setRequestHeader("Authorization", `Bearer ${accessToken}`);
      request.responseType = "json";
      request.withCredentials = true;

      this.request = request;
      this.request.send(data);

      return { id: uploadId, request };
    },
    cancel() {
      if (this.request) this.request.abort();
    }
  };

  return fileUploader;
}

function fileUploadInput(type, onChange, attrs = {}) {
  const input = document.createElement("input");

  input.type = "file";
  input.hidden = true;
  input.webkitdirectory = type === "folder";

  let attrsList = Object.keys(attrs);

  if (attrsList.includes("accept")) {
    input.accept = attrs.accept.join(",");
    attrsList = attrsList.filter(attr => attr !== "accept");
  }

  attrsList.forEach(prop => {
    input[prop] = attrs[prop];
  });

  input.addEventListener(
    "change",
    event => {
      onChange(event);
      input.remove();
    },
    { once: true }
  );

  document.body.appendChild(input);
  input.click();
}

export { createFileUploader, fileUploadInput };
