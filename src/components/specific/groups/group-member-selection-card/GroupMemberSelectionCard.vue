<template>
  <div class="group-member-selection-card">
    <transition name="fade" mode="out-in">
      <template v-if="showSelector">
        <div class="group-member-selection-card__selector">
          <div class="group-member-selection-card__selector__title">
            {{ $t("GroupMemberSelectionCard.title") }}
            <BIMDataButton ghost rounded icon @click.stop="closeSelector">
              <BIMDataIcon name="close" size="xxs" />
            </BIMDataButton>
          </div>
          <BIMDataSelect
            class="group-member-selection-card__selector__input"
            :label="$t('GroupMemberSelectionCard.selectorLabel')"
            :multi="true"
            :options="users"
            optionKey="firstname"
            :modelValue="group.members"
          />
          <div class="group-member-selection-card__selector__actions">
            <BIMDataButton width="80px" ghost radius @click="closeSelector">
              {{ $t("GroupMemberSelectionCard.cancelButtonText") }}
            </BIMDataButton>
            <BIMDataButton
              width="80px"
              color="primary"
              fill
              radius
              @click="() => {}"
            >
              {{ $t("GroupMemberSelectionCard.submitButtonText") }}
            </BIMDataButton>
          </div>
        </div>
      </template>

      <template v-else>
        <div
          data-test="btn-open-create"
          class="group-member-selection-card__btn-open"
          @click="openSelector"
        >
          <div class="group-member-selection-card__btn-open__icon">
            <BIMDataIcon name="plus" size="l" />
          </div>
          <div class="group-member-selection-card__btn-open__text">
            {{ $t("GroupMemberSelectionCard.text") }}
          </div>
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    group: {
      type: Object,
      required: true
    },
    users: {
      type: Array,
      required: true
    }
  },
  setup() {
    const showSelector = ref(false);
    const openSelector = () => {
      showSelector.value = true;
    };
    const closeSelector = () => {
      showSelector.value = false;
    };

    return {
      // References
      showSelector,
      // Methods
      closeSelector,
      openSelector
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupMemberSelectionCard.scss"></style>
