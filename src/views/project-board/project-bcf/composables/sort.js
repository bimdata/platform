import { computed, ref } from "vue";
import { useListSort } from "@/composables/list-sort.js";

function useSort(topics) {
  // sort by topic title
  const { sortToggle: sortToggleName, sortOrder: nameSortOrder } = useListSort(
    topics,
    topic => topic.title
  );
  const isSortByNameActive = computed(() => nameSortOrder.value === "asc");

  // sort by topic index
  const { sortToggle: sortToggleIndex, sortOrder: indexSortOrder } =
    useListSort(topics, topic => topic.index);
  const isSortByIndexActive = computed(() => indexSortOrder.value === "asc");

  // sort by topic date
  const { sortToggle: sortToggleDate, sortOrder: dateSortOrder } = useListSort(
    topics,
    topic => topic.creationDate
  );
  const isSortByDateActive = computed(() => dateSortOrder.value === "asc");

  const activeButton = ref("dateSort");
  const sortByName = () => {
    sortToggleName();
    activeButton.value = "nameSort";
  };
  const sortByIndex = () => {
    sortToggleIndex();
    activeButton.value = "indexSort";
  };
  const sortByDate = () => {
    sortToggleDate();
    activeButton.value = "dateSort";
  };

  return {
    sortByName,
    sortByIndex,
    sortByDate,
    activeButton,
    isSortByNameActive,
    isSortByIndexActive,
    isSortByDateActive
  };
}

export default useSort;
