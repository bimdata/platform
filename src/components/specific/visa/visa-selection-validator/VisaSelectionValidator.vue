<template>
  <div class="visa-add-validator">
    <div class="visa-add-validator__header">
      <div class="visa-add-validator__header__left-side">
        <BIMDataButton ghost rounded icon @click="$emit('get-back')">
          <BIMDataIconArrow size="xxs" />
        </BIMDataButton>
        <span>{{ $t("t.back") }}</span>
      </div>
      <div class="visa-add-validator__header__middle">
        {{ $t("Visa.validator") }}
      </div>
      <div class="visa-add-validator__header__right-side">
        <BIMDataButton ghost rounded icon @click="$emit('get-back')">
          <BIMDataIconClose size="xxxs" />
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
    <div
      class="visa-add-validator__people-list"
      data-test-id="visa-validator-list"
    >
      <VisaValidatorUsers
        :userList="peopleList"
        @update-people="updatedSelection = $event"
      />
    </div>
    <div class="visa-add-validator__action">
      <BIMDataButton
        data-test-id="btn-submit-validators"
        color="primary"
        fill
        radius
        width="100%"
        @click="onClick"
      >
        {{ $t("Visa.accept") }}
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
// Components
import VisaValidatorUsers from "./visa-selection-validator-users/VisaSelectionValidatorUsers.vue";

export default {
  components: {
    VisaValidatorUsers
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
    const updatedSelection = ref(null);

    const peopleListCounter = computed(
      () => peopleList.value.filter(({ isSelected }) => isSelected).length
    );

    const getUserListUpdated = () => {
      peopleList.value = (updatedSelection.value || props.userList)
        .map(people => ({
          ...people,
          isFindable:
            filter.value === ""
              ? true
              : people.searchContent.includes(filter.value.toLowerCase())
        }))
        .sort((a, b) => {
          if (!a.hasAccess) return 1;
          if (!b.hasAccess) return -1;
        });
    };

    watch(filter, () => getUserListUpdated(), { immediate: true });

    const onClick = () => {
      emit("validator-list", peopleList.value);
      emit("get-back");
    };

    return {
      // references
      peopleList,
      peopleListCounter,
      updatedSelection,
      filter,
      // methods
      onClick
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSelectionValidator.scss"></style>
