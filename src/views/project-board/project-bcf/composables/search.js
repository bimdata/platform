import { computed, ref } from "vue";

function useSearch(topics) {
  const searchText = ref("");
  const searchedTopics = computed(() => {
    const colunmToFilter = [
      "title",
      "topicStatus",
      "topicType",
      "description",
      "priority",
      "creationAuthor",
      "modifiedAuthor",
      "assignedTo",
      "stage"
    ];
    if (searchText.value) {
      const agnosticFilter = searchText.value.toLowerCase();
      return topics.value.filter(topic =>
        colunmToFilter.some(colunm =>
          (topic[colunm] || "").toLowerCase().includes(agnosticFilter)
        )
      );
    } else {
      return topics.value;
    }
  });

  return {
    searchText,
    searchedTopics
  };
}

export default useSearch;
