import { ref, watch } from "vue";

function useSearch(topics) {
  const searchText = ref("");
  const searchedTopics = ref([]);
  watch(
    [topics, searchText],
    () => {
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
        searchedTopics.value = topics.value.filter(topic =>
          colunmToFilter.some(colunm =>
            (topic[colunm] || "").toLowerCase().includes(agnosticFilter)
          )
        );
      } else {
        searchedTopics.value = topics.value;
      }
    },
    { immediate: true }
  );

  return {
    searchText,
    searchedTopics
  };
}

export default useSearch;
