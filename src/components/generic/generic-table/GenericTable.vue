<template>
  <div class="generic-table">
    <table class="generic-table__table">
      <thead>
        <tr>
          <th v-if="selectable">
            <BIMDataCheckbox
              :modelValue="selection.size === rows.length"
              @update:modelValue="toggleFullSelection"
            />
          </th>
          <th v-for="(column, j) of columns" :key="`head-row-0-col-${j}`">
            {{ column.id ? column.label || column.id : column }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, i) of rows" :key="`body-row-${i}`">
          <tr v-if="row">
            <td v-if="selectable">
              <BIMDataCheckbox
                :modelValue="selection.has(i)"
                @update:modelValue="toggleSelection(i)"
              />
            </td>
            <td v-for="(column, j) of columns" :key="`body-row-${i}-col-${j}`">
              <slot :name="`cell-${column.id}`" :row="row">
                {{ row[column.id] || row[j] || "" }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, watch, watchEffect } from "vue";
// Components
import BIMDataCheckbox from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCheckbox.js";

export default {
  components: {
    BIMDataCheckbox
  },
  props: {
    columns: {
      type: Array,
      required: true
    },
    rows: {
      type: Array,
      required: true
    },
    rowKey: {
      type: String,
      default: "id"
    },
    selectable: {
      type: Boolean,
      default: false
    },
    paginated: {
      type: Boolean,
      default: false
    },
    perPage: {
      type: Number,
      default: 10
    }
  },
  emits: [
    "selection-change",
    "row-selected",
    "row-unselected",
    "all-selected",
    "all-unselected"
  ],
  setup(props, { emit }) {
    const selection = ref(new Map());
    watch(selection, map => {
      emit("selection-change", Array.from(map.values()));
    });

    let selectionRefs;
    const buildSelectionRefs = (rows, value) => {
      selectionRefs = [];
      rows.forEach((row, i) => {
        selectionRefs[i] = ref(value);
        watch(selectionRefs[i], checked => {
          if (props.selectable) {
            if (checked) {
              selection.value.set(i, row);
              selection.value = new Map([...selection.value.entries()]);
              emit("row-selected", row);
            } else {
              selection.value.delete(i);
              selection.value = new Map([...selection.value.entries()]);
              emit("row-unselected", row);
            }
          }
        });
      });
    };

    const fullSelectionRef = ref(false);
    watch(fullSelectionRef, checked => {
      if (props.selectable) {
        if (checked) {
          selection.value = new Map([...props.rows.map((row, i) => [i, row])]);
          buildSelectionRefs(props.rows, true);
          emit("all-selected");
        } else {
          selection.value = new Map();
          buildSelectionRefs(props.rows, false);
          emit("all-unselected");
        }
      }
    });

    watchEffect(() => {
      buildSelectionRefs(props.rows, false);
    });

    const toggleSelection = i => {
      selectionRefs[i].value = !selectionRefs[i].value;
    };

    const toggleFullSelection = () => {
      fullSelectionRef.value = !fullSelectionRef.value;
    };

    return {
      // Refrences
      selection,
      // Methods
      toggleFullSelection,
      toggleSelection
    };
  }
};
</script>

<style scoped lang="scss" src="./GenericTable.scss"></style>
