<template>
  <div class="visa-add-validator">
    <div class="visa-add-validator__header">
      <div class="visa-add-validator__header__left-side">
        <BIMDataButton ghost rounded icon @click="$emit('get-back')">
          <BIMDataIcon name="arrow" size="xxs" />
        </BIMDataButton>
        <span>{{ $t("Visa.add.validatorView.getBack") }}</span>
      </div>
      <div class="visa-add-validator__header__middle">
        {{ $t("Visa.add.validatorView.validator") }}
      </div>
      <div class="visa-add-validator__header__right-side">
        <BIMDataButton ghost rounded icon @click="$emit('get-back')">
          <BIMDataIcon name="close" size="xxxs" />
        </BIMDataButton>
      </div>
    </div>
    <div class="visa-add-validator__search-bar">
      <BIMDataSearch
        v-model="filter"
        placeholder="Search"
        color="primary"
        radius
        width="100%"
      >
      </BIMDataSearch>
    </div>
    <div class="visa-add-validator__people-list">
      <VisaValidatorPeople :userList="peopleList" />
    </div>
    <div class="visa-add-validator__action">
      <BIMDataButton color="primary" fill radius width="100%" @click="onClick">
        {{ $t("Visa.add.validatorView.accept") }}
        <div class="visa-add-validator__action__counter">
          <span>
            {{ peopleListCounter }}
          </span>
        </div>
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";

import VisaValidatorPeople from "./visa-selection-validator-people/VisaSelectionValidatorPeople.vue";

export default {
  components: {
    VisaValidatorPeople
  },
  props: {
    userList: {
      type: Array,
      required: true
    }
  },
  emits: ["close", "validator-list", "get-back"],
  setup(props, { emit }) {
    const filter = ref("");
    const peopleList = ref([]);

    const peopleListCounter = computed(
      () => peopleList.value.filter(({ isSelected }) => isSelected).length
    );

    watch(
      filter,
      () => {
        peopleList.value = props.userList
          .map(people => ({
            ...people,
            isFindable:
              filter.value === ""
                ? true
                : people.searchContent.includes(filter.value.toLowerCase())
          }))
          .filter(({ isFindable }) => isFindable)
          .sort((a, b) => {
            if (!a.hasAccess) return 1;
            if (!b.hasAccess) return -1;
          });
      },
      { immediate: true }
    );

    const onClick = () => {
      emit("validator-list", peopleList);
      emit("get-back");
    };

    return {
      // references
      peopleList,
      peopleListCounter,
      filter,
      // methods
      onClick
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSelectionValidator.scss"></style>
