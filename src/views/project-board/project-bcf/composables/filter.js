import { computed, reactive } from "vue";

function useFilter(topics) {
  const filters = reactive({
    priorities: [],
    status: [],
    tags: []
  });

  function onFiltersSubmit(submittedFilters) {
    filters.épriorities = submittedFilters.priorities;
    filters.status = submittedFilters.status;
    filters.tags = submittedFilters.tags;
  }

  const filteredTopics = computed(() =>
    topics.value
      .filter(
        topic =>
          filters.priorities.length === 0 ||
          filters.priorities.includes(topic.priority)
      )
      .filter(
        topic =>
          filters.status.length === 0 || filters.status.includes(topic.status)
      )
      .filter(
        topic =>
          filters.tags.length === 0 ||
          filters.tags.some(tag => topic.labels.includes(tag))
      )
  );

  return {
    onFiltersSubmit,
    filteredTopics
  };
}

export default useFilter;
