import UploadService from "@/server/UploadService";

const spaceImageUploader = (space, handlers) => {
  return UploadService.createSpaceImageUploader(space, handlers);
};

const modelUploader = (project, handlers) => {
  return UploadService.createModelUploader(project, handlers);
};

const fileUploader = (project, handlers) => {
  return UploadService.createFileUploader(project, handlers);
};

export function useUpload() {
  return {
    spaceImageUploader,
    modelUploader,
    fileUploader
  };
}
