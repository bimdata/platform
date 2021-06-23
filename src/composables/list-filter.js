import { isRef, ref, watch } from "vue";

export function useListFilter(list, mapper = elem => elem) {
  const initialList = isRef(list) ? list : ref(list);
  const filteredList = ref([]);
  const searchText = ref("");

  const filter = value => {
    const text = value.trim().toLowerCase();
    if (text) {
      filteredList.value = initialList.value.filter(elem =>
        mapper(elem).toLowerCase().includes(text)
      );
    } else {
      filteredList.value = initialList.value;
    }
  };

  watch(
    [() => initialList.value, () => searchText.value],
    () => filter(searchText.value),
    { immediate: true }
  );

  return {
    initialList,
    filteredList,
    searchText
  };
}
