<template>
  <div class="generic-table">
    <div
      class="generic-table__container"
      :style="{ minHeight: paginated ? `${(perPage + 1) * 50}px` : undefined }"
    >
      <table>
        <thead>
          <tr key="head-row-0">
            <th class="cell-checkbox" v-if="selectable">
              <BIMDataCheckbox
                :disabled="rows.length === 0"
                :modelValue="rows.length > 0 && selection.size === rows.length"
                @update:modelValue="toggleFullSelection"
              />
            </th>
            <template
              v-for="(column, j) of columns"
              :key="`head-row-0-col-${j}`"
            >
              <th
                :style="{
                  width: column.width || 'auto',
                  textAlign: column.align || 'left'
                }"
              >
                {{ column.id ? column.label || column.id : column }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-for="(row, i) of rows" :key="`body-row-${i}`">
            <tr v-if="row" v-show="displayedRows.includes(i)">
              <td class="cell-checkbox" v-if="selectable">
                <BIMDataCheckbox
                  :modelValue="selection.has(i)"
                  @update:modelValue="toggleSelection(i)"
                />
              </td>
              <td
                v-for="(column, j) of columns"
                :key="`body-row-${i}-col-${j}`"
                :style="{
                  width: column.width || 'auto',
                  textAlign: column.align || 'left'
                }"
              >
                <slot :name="`cell-${column.id}`" :row="row">
                  {{ row[column.id] || row[j] || "" }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div
      class="generic-table__page-nav"
      v-if="paginated"
      :style="{ visibility: rows.length > perPage ? 'visible' : 'hidden' }"
    >
      <BIMDataButton
        ghost
        rounded
        icon
        :disabled="pageStartIndex === 1"
        @click="pageIndex--"
      >
        <BIMDataIcon name="chevron" size="s" :rotate="180" />
      </BIMDataButton>
      <span class="generic-table__page-nav__text">
        {{
          $t("GenericTable.pagination", {
            start: pageStartIndex,
            end: pageEndIndex,
            total: rows.length
          })
        }}
      </span>
      <BIMDataButton
        ghost
        rounded
        icon
        :disabled="pageEndIndex === rows.length"
        @click="pageIndex++"
      >
        <BIMDataIcon name="chevron" size="s" />
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataCheckbox from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCheckbox.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataCheckbox,
    BIMDataIcon
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

    const displayedRows = ref([]);
    const pageIndex = ref(0);
    const pageStartIndex = ref(1);
    const pageEndIndex = ref(props.perPage);
    watch(
      () => props.rows,
      () => {
        selection.value = new Map();
        buildSelectionRefs(props.rows, false);
      },
      { immediate: true }
    );
    watch(
      [() => props.rows, () => props.paginated, () => props.perPage, pageIndex],
      () => {
        const rowIndexes = props.rows.map((_, i) => i);
        if (props.paginated) {
          const start = props.perPage * pageIndex.value;
          const end = start + props.perPage;

          displayedRows.value = rowIndexes.slice(start, end);
          pageStartIndex.value = start + 1;
          pageEndIndex.value = Math.min(end, props.rows.length);
        } else {
          displayedRows.value = rowIndexes;
        }
      },
      { immediate: true }
    );

    const toggleSelection = i => {
      selectionRefs[i].value = !selectionRefs[i].value;
    };

    const toggleFullSelection = () => {
      fullSelectionRef.value = !fullSelectionRef.value;
    };

    return {
      // Refrences
      displayedRows,
      pageEndIndex,
      pageIndex,
      pageStartIndex,
      selection,
      // Methods
      toggleFullSelection,
      toggleSelection
    };
  }
};
</script>

<style scoped lang="scss" src="./GenericTable.scss"></style>
