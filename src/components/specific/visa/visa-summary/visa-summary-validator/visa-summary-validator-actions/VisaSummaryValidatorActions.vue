<template>
  <div className="visa-summary-validator-actions" v-click-away="closeMenu">
    <BIMDataButton
      class="visa-summary-validator-actions__btn"
      data-test-id="btn-action-visa-summary-validator"
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIconEllipsis size="l" />
    </BIMDataButton>
    <transition name="fade">
      <div class="visa-summary-validator-actions__menu" v-show="showMenu">
        <BIMDataButton
          class="visa-summary-validator-actions__menu__btn"
          data-test-id="btn-delete-validator"
          ghost
          squared
          @click="onDelete"
        >
          {{ $t("Visa.summary.validatorList.getRidOfValidator") }}
        </BIMDataButton>
        <template v-if="hasAccess">
          <BIMDataButton
            class="visa-summary-validator-actions__menu__btn"
            data-test-id="btn-refresh-validator"
            ghost
            squared
            @click="onReset"
          >
            {{ $t("Visa.summary.validatorList.refresh") }}
          </BIMDataButton>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
import { useToggle } from "../../../../../../composables/toggle.js";

export default {
  props: {
    validationId: {
      type: Number,
      required: true
    },
    hasAccess: {
      type: Boolean,
      required: true
    }
  },
  emits: ["reset-validation", "delete-validation"],
  setup(props, { emit }) {
    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    const onReset = () => {
      emit("reset-validation", props.validationId);
      closeMenu();
    };

    const onDelete = () => {
      emit("delete-validation", props.validationId);
      closeMenu();
    };

    return {
      // references
      showMenu,
      // Methods
      closeMenu,
      toggleMenu,
      onDelete,
      onReset
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSummaryValidatorActions.scss"></style>
