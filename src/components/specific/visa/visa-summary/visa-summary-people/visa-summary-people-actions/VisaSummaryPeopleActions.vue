<template>
  <div className="visa-summary-people-actions" v-click-away="closeMenu">
    <BIMDataButton
      class="visa-summary-people-actions__btn"
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>
    <transition name="fade">
      <div class="visa-summary-people-actions__menu" v-show="showMenu">
        <BIMDataButton
          class="visa-summary-people-actions__menu__btn"
          ghost
          squared
          @click="onClick('delete-val')"
        >
          {{ $t("Visa.summary.people.getRidOfValidator") }}
        </BIMDataButton>
        <BIMDataButton
          class="visa-summary-people-actions__menu__btn"
          ghost
          squared
          @click="onClick('reset-visa')"
        >
          {{ $t("Visa.summary.people.refresh") }}
        </BIMDataButton>
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
    }
  },
  emits: ["delete-val", "reset-visa"],
  setup(props, { emit }) {
    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    const onClick = event => {
      emit(event, props.validationId);
      closeMenu();
    };
    return {
      // references
      showMenu,
      // Methods
      closeMenu,
      toggleMenu,
      onClick
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSummaryPeopleActions.scss"></style>
