/**
 * @param {Object} params
 * @param {Object} handlers
 * @param {Object} options
 * @returns {{
 *  upload: FormData => {
 *    id: number,
 *    request: XMLHttpRequest,
 *    promise: Promise,
 *    cancel: () => void
 *  }
 * }} file uploader
 */
function createFileUploader(
  { method, url, accessToken },
  {
    onUploadStart = () => {},
    onUploadProgress = () => {},
    onUploadComplete = () => {},
    onUploadRetry = () => {},
    onUploadError = () => {},
    onUploadCancel = () => {}
  },
  { retryCount = 0, retryInterval = 0 } = {}
) {
  let nextUploadId = 0;

  const fileUploader = {
    upload(data) {
      if (!(data instanceof FormData)) {
        console.error(
          "[File Uploader] Error: 'data' argument must be an instance of FormData."
        );
        return;
      }

      let request, resolve, reject;
      let count = 0;

      const uploadId = nextUploadId++;
      const promise = new Promise(
        (res, rej) => ((resolve = res), (reject = rej))
      );

      const handleError = e => {
        if (count < retryCount) {
          count++;
          onUploadRetry({ id: uploadId, error: e, count });
          setTimeout(sendRequest, retryInterval);
        } else {
          onUploadError({ id: uploadId, error: e });
          reject({ id: uploadId, error: e });
        }
      };

      const sendRequest = () => {
        // Abort any previous request that is not terminated
        if (request?.readyState < XMLHttpRequest.DONE) request?.abort();

        request = new XMLHttpRequest();

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
          if (request.status < 400) {
            const data = {
              id: uploadId,
              bytesUploaded: e.loaded,
              bytesTotal: e.total,
              percentage: (e.loaded / e.total) * 100,
              response: request.response
            };
            onUploadComplete(data);
            resolve(data);
          } else {
            handleError(e);
          }
        });
        request.upload.addEventListener("error", e => {
          handleError(e);
        });
        request.upload.addEventListener("abort", e => {
          onUploadCancel(e);
          reject(e);
        });

        request.open(method, url);
        request.setRequestHeader("Authorization", `Bearer ${accessToken}`);
        request.responseType = "json";
        request.withCredentials = true;
        request.send(data);
      };

      sendRequest();

      return {
        id: uploadId,
        promise,
        request: () => request,
        cancel: () => request.abort()
      };
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
