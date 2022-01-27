<template>
  <div className="visa-summary-validator-actions" v-click-away="closeMenu">
    <BIMDataButton
      class="visa-summary-validator-actions__btn"
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>
    <transition name="fade">
      <div class="visa-summary-validator-actions__menu" v-show="showMenu">
        <BIMDataButton
          class="visa-summary-validator-actions__menu__btn"
          ghost
          squared
          @click="onDelete"
        >
          {{ $t("Visa.summary.validatorList.getRidOfValidator") }}
        </BIMDataButton>
        <template v-if="hasAccess">
          <BIMDataButton
            class="visa-summary-validator-actions__menu__btn"
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
import { useToggle } from "@/composables/toggle.js";

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
  emits: ["delete-user", "reset-val"],
  setup(props, { emit }) {
    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    const onDelete = () => {
      emit("delete-user", props.validationId);
      closeMenu();
    };
    const onReset = () => {
      emit("reset-val", props.validationId);
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
