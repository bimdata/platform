<template>
  <div class="visa-actions-cell flex flex-col items-center justify-center" v-click-away="closeMenu">
    <BIMDataButton ripple rounded icon @click="() => (isOpen ? closeMenu() : openMenu())">
      <BIMDataIconEllipsis size="l" fill color="granite-light" />
    </BIMDataButton>
    <BIMDataMenu
      v-show="isOpen"
      class="visa-actions-cell__menu"
      :menuItems="menuItems"
      width="130px"
      ref="menu"
    >
      <template #item="{ item }">
        <BIMDataButton
          :color="item.color"
          class="visa-actions-cell__menu__item"
          ghost
          squared
          width="100%"
        >
          <BIMDataIcon :name="item.icon" size="xs" margin="0 12px 0 0" />
          <span>
            {{ $t(item.text) }}
          </span>
        </BIMDataButton>
      </template>
    </BIMDataMenu>
  </div>
</template>

<script>
import { nextTick, ref, shallowRef } from "vue";

export default {
  setup() {
    const menu = ref(null);
    const isOpen = ref(false);
    const menuItems = shallowRef([]);

    const openMenu = () => {
      isOpen.value = true;
      menuItems.value.push({
        key: 1,
        text: "t.edit",
        icon: "edit",
        action: () => onClick(),
        color: "primary",
      });
      menuItems.value.push({
        key: 2,
        text: "t.delete",
        icon: "delete",
        action: () => onClick("delete"),
        color: "high",
        background: "var(--color-high-lighter)",
      });
    }

    const closeMenu = () => {
      isOpen.value = false;
      menuItems.value = [];
      nextTick(() => {
        menu.value.$el.style.top = "";
      });
    };

    return {
      menu,
      isOpen,
      menuItems,
      closeMenu,
      openMenu,
    };
  },
};
</script>

<style scoped lang="scss">
.visa-actions-cell {
  position: relative;
  &__menu {
    padding: calc(var(--spacing-unit) / 2) 0;
    position: absolute;
    top: 30px;
    right: 0;
    z-index: 1;
    &.bimdata-menu {
      &:deep() {
        .bimdata-menu__item__content {
          padding: 0;
          .bimdata-btn {
            justify-content: flex-start;
          }
        }
      }
    }
  }
}
</style>
