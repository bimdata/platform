<template>
  <div class="breadcrumb-selector" v-click-away="close">
    <div class="breadcrumb-selector__header">
      <TextBox
        :text="currentItem[labelProp] || placeholder"
        :maxLength="24"
        @click="$emit('header-clicked', currentItem)"
      />
      <BIMDataIcon
        class="breadcrumb-selector__header__icon"
        name="chevron"
        size="xxs"
        :rotate="isActive ? 90 : 0"
        @click="toggle"
      />
    </div>
    <transition name="slide-fade-down">
      <div class="breadcrumb-selector__list" v-show="isActive">
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
            <TextBox
              :text="item[labelProp]"
              :maxLength="24"
              cutOn="end"
              :tooltip="false"
            />
          </div>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useToggle } from "@/composables/toggle";
import { useListFilter } from "@/composables/list-filter";
// Components
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";
import TextBox from "@/components/generic/text-box/TextBox";

export default {
  components: {
    BIMDataIcon,
    BIMDataSearch,
    TextBox
  },
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    keyProp: {
      type: String,
      default: "id"
    },
    labelProp: {
      type: String,
      required: true
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  emits: ["header-clicked", "item-selected"],
  setup(props, { emit }) {
    const { isOpen: isActive, close, toggle } = useToggle();

    const { filteredList: displayedItems, searchText } = useListFilter(
      computed(() => props.list),
      item => item[props.labelProp]
    );

    const currentItem = ref({});

    const selectItem = item => {
      close();
      currentItem.value = item;
      emit("item-selected", item);
    };

    return {
      // References
      currentItem,
      displayedItems,
      isActive,
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
