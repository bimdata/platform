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

      let request;
      let count = 0;

      const uploadId = nextUploadId++;

      const handleError = (status, err) => {
        if (status >= 500 && count < retryCount) {
          count++;
          onUploadRetry({ id: uploadId, status, error: err, count });
          setTimeout(sendRequest, retryInterval);
        } else {
          onUploadError({ id: uploadId, status, error: err });
        }
      };

      const sendRequest = () => {
        request = new XMLHttpRequest();

        request.upload.addEventListener("loadstart", ({ loaded, total }) => {
          onUploadStart({
            id: uploadId,
            bytesUploaded: loaded,
            bytesTotal: total,
            percentage: (loaded / total) * 100
          });
        });
        request.upload.addEventListener("progress", ({ loaded, total }) => {
          onUploadProgress({
            id: uploadId,
            bytesUploaded: loaded,
            bytesTotal: total,
            percentage: (loaded / total) * 100
          });
        });
        request.addEventListener("load", e => {
          if (request.status < 400) {
            onUploadComplete({
              id: uploadId,
              bytesUploaded: e.loaded,
              bytesTotal: e.total,
              percentage: (e.loaded / e.total) * 100,
              response: request.response
            });
          } else {
            handleError(request.status, e);
          }
        });
        request.upload.addEventListener("error", e => {
          handleError(request.status, e);
        });
        request.upload.addEventListener("abort", e => {
          onUploadCancel(e);
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

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === "accept" && Array.isArray(value)) {
      value = value.join(",");
    }
    input[key] = value;
  });

  input.addEventListener(
    "change",
    event => {
      onChange(event);
      input.remove();
    },
    { once: true }
  );
  input.addEventListener(
    "cancel",
    () => {
      input.remove();
    }
  );

  document.body.appendChild(input);
  input.click();
}

export { createFileUploader, fileUploadInput };
