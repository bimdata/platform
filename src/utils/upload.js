import { toCamelCaseFields } from "./misc.js";

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
  const fileUploader = {
    request: null,
    upload(data) {
      if (!(data instanceof FormData)) {
        console.error(
          "[File Uploader] Error: 'data' argument is not an instance of FormData."
        );
        return;
      }

      const request = new XMLHttpRequest();

      request.upload.addEventListener("loadstart", e => {
        onUploadStart({
          bytesUploaded: e.loaded,
          bytesTotal: e.total,
          percentage: (e.loaded / e.total) * 100
        });
      });
      request.upload.addEventListener("progress", e => {
        onUploadProgress({
          bytesUploaded: e.loaded,
          bytesTotal: e.total,
          percentage: (e.loaded / e.total) * 100
        });
      });
      request.addEventListener("load", e => {
        onUploadComplete({
          bytesUploaded: e.loaded,
          bytesTotal: e.total,
          percentage: (e.loaded / e.total) * 100,
          response: toCamelCaseFields(request.response)
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
      return this.request;
    },
    cancel() {
      if (this.request) this.request.abort();
    }
  };

  return fileUploader;
}

export { createFileUploader };
