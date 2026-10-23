import { ref, watch } from "vue";

export function useNameEditing(rows) {
  const editedNameId = ref(null);

  const closeNameEditor = id => {
    if (editedNameId.value === id) {
      editedNameId.value = null;
    }
  };

  watch(rows, () => {
    editedNameId.value = null;
  });

  return { editedNameId, closeNameEditor };
}
