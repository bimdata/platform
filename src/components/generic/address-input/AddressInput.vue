<template>
  <div class="address-input" v-click-away="selectionStop">
    <BIMDataInput
      class="address-input__input"
      :placeholder="placeholder"
      :loading="loading || isSearching"
      :disabled="disabled"
      v-model="searchText"
      @keydown.up.prevent.stop="selectionUp"
      @keydown.down.prevent.stop="selectionDown"
      @keydown.esc.prevent.stop="selectionStop"
      @keyup.enter.stop="selectAdress(selectionIndex)"
      @click.stop="selectionIndex = -1"
    />
    <transition name="slide-fade-down">
      <div
        v-if="showSuggestions && suggestions.length > 0"
        class="address-input__suggestions"
      >
        <transition-group name="list">
          <div
            v-for="(result, i) in suggestions"
            :key="i"
            class="address-input__suggestions__item"
            :class="{ hovered: selectionIndex === i }"
            @click="selectAdress(i)"
          >
            <span class="address-input__suggestions__item__icon">
              <BIMDataIcon name="location" size="xs" />
            </span>
            <span class="address-input__suggestions__item__text">
              {{ result.address }}
            </span>
          </div>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, watch, watchEffect } from "vue";
import { getAdressesFromSearchText } from "@/utils/location";
// Components
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataInput.js";

export default {
  components: {
    BIMDataIcon,
    BIMDataInput
  },
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue", "address-selected"],
  setup(props, { emit }) {
    const searchText = ref("");
    const isSearching = ref(false);
    const suggestions = ref([]);
    const showSuggestions = ref(false);
    const selectionIndex = ref(-1);

    watchEffect(() => {
      searchText.value = props.modelValue;
    });

    let searchSelected = false;
    let searchDebounce = null;
    watch(searchText, value => {
      selectionIndex.value = -1;
      emit("update:modelValue", value);
      if (searchSelected) {
        searchSelected = false;
      } else if (value) {
        showSuggestions.value = true;
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(async () => {
          isSearching.value = true;
          suggestions.value = await getAdressesFromSearchText(value);
          isSearching.value = false;
        }, 500);
      } else {
        showSuggestions.value = false;
        suggestions.value = [];
      }
    });

    const selectionUp = () => {
      selectionIndex.value =
        selectionIndex.value > 0
          ? selectionIndex.value - 1
          : suggestions.value.length - 1;
    };

    const selectionDown = () => {
      selectionIndex.value =
        (selectionIndex.value + 1) % suggestions.value.length;
    };

    const selectionStop = () => {
      selectionIndex.value = -1;
      showSuggestions.value = false;
    };

    const selectAdress = index => {
      if (index >= 0) {
        selectionIndex.value = -1;
        showSuggestions.value = false;
        searchSelected = true;
        searchText.value = suggestions.value[index].address;
        emit("address-selected", suggestions.value[index]);
      }
    };

    return {
      // References
      isSearching,
      searchText,
      selectionIndex,
      showSuggestions,
      suggestions,
      // Methods
      selectAdress,
      selectionDown,
      selectionStop,
      selectionUp
    };
  }
};
</script>

<style scoped lang="scss" src="./AddressInput.scss"></style>
