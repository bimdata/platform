<template>
  <div>
    <ul class="bimdata-list">
      <li v-for="{ id, name } in filteredTags">
        <BIMDataCheckbox :id="id" :text="name"  />
      </li>
    </ul>
  </div>
</template>

<script>
import BIMDataCheckbox from "@bimdata/design-system/src/BIMDataComponents/BIMDataCheckbox/BIMDataCheckbox.vue";
import { ref } from "vue";
export default {
  name: "ColumnFilters",
  props: {
    rows: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const tags = ref([]);
    tags.value = props.rows
      .map((row) => row.data.tags)
      .filter(Boolean)
      .flat();

    const ids = tags.value.map(({ id }) => id);
    const filteredTags = tags.value.filter(({ id }, index) => !ids.includes(id, index + 1));

    return {
      filteredTags,
    };
  },
};
</script>
