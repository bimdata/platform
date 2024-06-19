<template>
  <div>
    <BIMDataButton ripple rounded icon @click="toggleMenu">
      <BIMDataIconEllipsis size="l" fill color="granite-light" />
    </BIMDataButton>
    <BIMDataMenu
      v-show="showMenu"
      class="models-manager__menu__container"
      :menuItems="menuItems"
      width="auto"
    >
      <template #item="{ item }">
        <div class="models-manager__menu__item" >
          <BIMDataCheckbox
            :text="item.text"
          />
        </div>
      </template>
    </BIMDataMenu>
  </div>
</template>

<script>
import { shallowRef } from "vue";
import { useToggle } from "../../../../../composables/toggle.js";
export default {
  setup(props) {
    const { isOpen: showMenu, close: closeMenu, toggle: toggleMenu } = useToggle();

    const menuItems = [];
    menuItems.push({
      key: 1,
      text: "archive",
      icon: 'archive',
      action: () => onClick(),
      color: "var(--color-primary)",
    });

    return {
      menuItems,
      showMenu,
      closeMenu,
      toggleMenu,
    };
  },
};
</script>
