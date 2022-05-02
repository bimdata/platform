import TagService from "@/services/TagService";

const fetchAllTags = async project => {
  return (await TagService.fetchAllTags(project)).sort();
};

export function useTag() {
  return {
    // Methods
    fetchAllTags
  };
}
