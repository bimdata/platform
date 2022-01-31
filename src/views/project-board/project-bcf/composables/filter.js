import { computed, reactive } from "vue";

function useFilter(topics) {
  const filters = reactive({
    priorities: [],
    status: [],
    tags: [],
    startDate: "",
    endDate: ""
  });

  function onFiltersSubmit(submittedFilters) {
    filters.priorities = submittedFilters.priorities;
    filters.status = submittedFilters.status;
    filters.tags = submittedFilters.tags;
    filters.startDate = submittedFilters.startDate;
    filters.endDate = submittedFilters.endDate;
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
          filters.status.length === 0 ||
          filters.status.includes(topic.topicStatus)
      )
      .filter(
        topic =>
          filters.tags.length === 0 ||
          filters.tags.some(tag => topic.labels.includes(tag))
      )
      .filter(topic => {
        if (filters.startDate && filters.endDate) {
          const formatStartTopicDate = filters.startDate
            .split("/")
            .reverse()
            .join("-");
          const formatEndTopicDate = filters.endDate
            .split("/")
            .reverse()
            .join("-");
          // add T for filter on one entire day
          const startTopicDate = new Date(formatStartTopicDate + "T00:00");
          const endTopicDate = new Date(formatEndTopicDate + "T23:59:59");
          return (
            startTopicDate <= topic.creationDate &&
            topic.creationDate <= endTopicDate
          );
        }

        return true;
      })
  );

  return {
    onFiltersSubmit,
    filteredTopics
  };
}

export default useFilter;
