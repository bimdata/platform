import TagService from "@/services/TagService";

const fetchAllTags = async project => {
  return (await TagService.fetchAllTags(project)).sort();
};

const createTag = async (project, data) => {
  return await TagService.createTag(project, data);
};

export function useTag() {
  return {
    // Methods
    fetchAllTags,
    createTag
  };
}
