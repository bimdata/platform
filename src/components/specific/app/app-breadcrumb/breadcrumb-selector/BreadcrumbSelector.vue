<template>
  <div class="breadcrumb-selector" v-click-away="close">
    <div class="breadcrumb-selector__header">
      <BIMDataTextBox
        class="breadcrumb-selector__header__text"
        :text="header"
        @click="$emit('header-clicked')"
      />
      <BIMDataIcon
        class="breadcrumb-selector__header__icon"
        name="chevron"
        size="xs"
        :rotate="isOpen ? 90 : 0"
        margin="0 0 0 6px"
        @click="toggle"
      />
    </div>
    <transition name="slide-fade-down">
      <div class="breadcrumb-selector__list" v-show="isOpen">
        <BIMDataSearch
          radius
          width="204px"
          :placeholder="$t('BreadcrumbSelector.inputPlaceholder')"
          v-model="searchText"
        />
        <transition-group name="list">
          <div
            class="breadcrumb-selector__list__item"
            v-for="item in displayedItems"
            :key="item[keyProp]"
            @click="() => selectItem(item)"
          >
            <BIMDataTextBox
              :text="item[labelProp]"
              cutPosition="end"
              :tooltip="false"
            />
          </div>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed } from "vue";
import { useToggle } from "@/composables/toggle";
import { useListFilter } from "@/composables/list-filter";

export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    keyProp: {
      type: String,
      default: "id"
    },
    labelProp: {
      type: String,
      required: true
    },
    header: {
      type: String,
      default: ""
    }
  },
  emits: ["header-clicked", "item-selected"],
  setup(props, { emit }) {
    const { isOpen, close, toggle } = useToggle();

    const { filteredList: displayedItems, searchText } = useListFilter(
      computed(() => props.list),
      item => item[props.labelProp]
    );

    const selectItem = item => {
      close();
      emit("item-selected", item);
    };

    return {
      // References
      displayedItems,
      isOpen,
      searchText,
      // Methods
      close,
      selectItem,
      toggle
    };
  }
};
</script>

<style scoped lang="scss" src="./BreadcrumbSelector.scss"></style>