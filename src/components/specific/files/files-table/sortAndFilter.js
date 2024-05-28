import { ref, computed, shallowReactive } from "vue";

// WARNING copied from DesignSystem... could be a good candidate for a shared module

export default function useSortAndFilter(rows, rowKey, columns) {
    const computedRows = computed(() =>
        rows.map((row, i) => ({ key: row[rowKey] ?? i, data: row }))
      );

    const displayedColumnFilterId = ref(null);

    const activeHeadercolumnKey = ref(null);

    const toggleFiltersMenu = column => {
      if (displayedColumnFilterId.value === column.id) {
        displayedColumnFilterId.value = null;
      } else {
        displayedColumnFilterId.value = column.id;
      }
    };

    const awayFromFilter = column => {
      if (column.id === displayedColumnFilterId.value) {
        displayedColumnFilterId.value = null;
      }
    };

    const sortObject = shallowReactive({ column: null, order: null });
    const filteringColumns = ref([]);
    const sortedRows = computed(() => {
      if (sortObject.column) {
        // by default, sort in ascending order
        const sortOrder = sortObject.order !== "desc" ? 1 : -1;
        if (sortObject.column.sortFunction) {
          const sortFunction = (a, b) => {
            return sortObject.column.sortFunction(a.data, b.data) * sortOrder;
          };
          return Array.from(computedRows.value).sort(sortFunction);
        } else {
          return Array.from(computedRows.value).sort((a, b) => {
            if (a.data[sortObject.column.id] < b.data[sortObject.column.id]) {
              return sortOrder;
            }
            if (a.data[sortObject.column.id] > b.data[sortObject.column.id]) {
              return -sortOrder;
            }
            return 0;
          });
        }
      }
      if (filteringColumns.value.length > 0) {
        return Array.from(computedRows.value).filter(row => {
          return (
            row.data[filteringColumns.value[0].id] ===
            filteringColumns.value[0].text
          );
        });
      }

      return computedRows.value;
    });

    const toggleSorting = column => {
      if (sortObject.column === column) {
        sortObject.order = sortObject.order === "asc" ? "desc" : "asc";
      } else {
        sortObject.column = column;
        sortObject.order = column.defaultSortOrder ?? "asc";
      }
    };

    /**
     * @typedef {Object} ColumnFilter
     * @property {number} columnKey
     * @property {any[]} columnFilters
     */

    /**
     * @type { { value: ColumnFilter[] } }
     */
    const filters = ref([]);

    const displayedRows = computed(() => {
      return sortedRows.value.filter(row => {
        return filters.value.every(filter => {
          const column = columns.find(
            column => column.id === filter.columnKey
          );
          const columnRowData = row.data[filter.columnKey];

          if (columnRowData === null) return;

          if (Array.isArray(columnRowData)) {
            return columnRowData.some(columnRowDataElement =>
              filter.columnFilters.includes(
                typeof column.filterFunction === "function"
                  ? column.filterFunction(columnRowDataElement)
                  : column.filterKey
                  ? columnRowDataElement[column.filterKey]
                  : columnRowDataElement
              )
            );
          } else {
            return filter.columnFilters.includes(
              typeof column.filterFunction === "function"
                ? column.filterFunction(columnRowData)
                : column.filterKey
                ? columnRowData[column.filterKey]
                : columnRowData
            );
          }
        });
      });
    });

    /**
     * @param {ColumnFilter} columnFilter
     */
    const updateFilters = (column, columnFilters) => {
      filters.value = filters.value.filter(
        filter => filter.columnKey !== column.id
      );
      if (columnFilters.length > 0) {
        filters.value.push({
          columnKey: column.id,
          columnFilters,
        });
      }
    };

    return {
      activeHeadercolumnKey,
      sortObject,
      displayedColumnFilterId,
      toggleFiltersMenu,
      awayFromFilter,
      toggleSorting,
      displayedRows,
      updateFilters,
      computedRows,
      filters,
    };
}