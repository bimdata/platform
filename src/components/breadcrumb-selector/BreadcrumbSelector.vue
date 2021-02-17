<template>
  <div
    class="breadcrumb-selector"
    :class="{ active: isActive }"
    v-click-away="closeList"
  >
    <div class="breadcrumb-selector__header" @click="toggleList">
      {{ header }}
      <BIMDataIcon
        class="breadcrumb-selector__header__icon"
        name="chevron"
        size="xxs"
      />
    </div>
    <transition name="dropdown">
      <div class="breadcrumb-selector__list" v-show="isActive">
        <BIMDataSearch
          radius
          width="204px"
          :placeholder="$t('Breadcrumb.search')"
          v-model="searchText"
        />
        <transition-group name="item-list">
          <div
            class="breadcrumb-selector__list__item"
            v-for="item in displayedItems"
            :key="item[keyProp]"
            @click="$emit('item-click', item)"
          >
            {{ item[labelProp] }}
          </div>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
// Components
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";

export default {
  components: {
    BIMDataIcon,
    BIMDataSearch
  },
  props: {
    header: {
      type: String,
      required: true
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
  emits: ["item-click"],
  setup(props) {
    const isActive = ref(false);
    const closeList = () => {
      isActive.value = false;
    };
    const toggleList = () => {
      isActive.value = !isActive.value;
    };

    const displayedItems = ref([]);
    watchEffect(() => (displayedItems.value = props.list));

    const searchText = ref("");
    const filterItems = value => {
      const text = value.trim().toLowerCase();
      if (text) {
        displayedItems.value = props.list.filter(a =>
          a[props.labelProp].toLowerCase().includes(text)
        );
      } else {
        displayedItems.value = props.list;
      }
    };
    watchEffect(() => filterItems(searchText.value));

    return {
      // References
      displayedItems,
      isActive,
      searchText,
      // Methods
      closeList,
      filterItems,
      toggleList
    };
  }
};
</script>

<style scoped lang="scss" src="./BreadcrumbSelector.scss"></style>
