import { isRef, ref } from "vue";

export function useListSort(list, mapper = elem => elem) {
  const initialList = isRef(list) ? list : ref(list);

  const sort = (order = "asc") => {
    const sortedList = initialList.value
      .slice()
      .sort((a, b) => (mapper(a) < mapper(b) ? -1 : 1));
    if (order === "desc") {
      sortedList.reverse();
    }
    initialList.value = sortedList;
  };

  let sortOrder = "none";
  const sortToggle = () => {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    sort(sortOrder);
  };

  return {
    sortedList: initialList,
    sort,
    sortToggle
  };
}
