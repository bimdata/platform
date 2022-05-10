import TagService from "@/services/TagService";

const fetchAllTags = async project => {
  return (await TagService.fetchAllTags(project)).sort();
};

const createTag = async (project, data) => {
  return await TagService.createTag(project, data);
};

const updateTag = async (project, tag, data) => {
  return await TagService.updateTag(project, tag, data);
};

const deleteTag = async (project, tag) => {
  return await TagService.deleteTag(project, tag);
};

const addDocumentTag = async (project, document, tag) => {
  return await TagService.addDocumentTag(project, document, tag);
};

const deleteDocumentTag = async (project, document, tag) => {
  return await TagService.deleteDocumentTag(project, document, tag);
};

export function useTag() {
  return {
    // Methods
    fetchAllTags,
    updateTag,
    createTag,
    deleteTag,
    addDocumentTag,
    deleteDocumentTag
  };
}
