<template>
  <div class="user-menu" v-click-away="closeMenu">
    <BIMDataDropdownMenu width="0">
      <template #header>
        <div class="user-menu__btn">
          <span class="user-menu__btn__picture">
            {{ initials }}
          </span>
          <span class="user-menu__btn__fullname">
            {{ `${firstName} ${lastName}` }}
          </span>
          <span class="user-menu__btn__email">
            {{ email }}
          </span>
        </div>
      </template>
      <template #element>
        <div class="user-menu__container" @click.stop="() => {}">
          <BIMDataSelect
            :label="$t('Header.selectLanguage')"
            :options="$i18n.availableLocales"
            v-model="$i18n.locale"
          />
          <BIMDataButton color="primary" fill radius @click="signOut">
            <BIMDataIcon name="logout" size="xxs" />
            <span>{{ $t("Header.logout") }}</span>
          </BIMDataButton>
        </div>
      </template>
    </BIMDataDropdownMenu>
  </div>
</template>

<script>
import { computed, ref, watchEffect } from "vue";
import { useAuth } from "@/state/auth";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataDropdownMenu from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataDropdownMenu.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSelect from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSelect.js";

export default {
  components: {
    BIMDataButton,
    BIMDataDropdownMenu,
    BIMDataIcon,
    BIMDataSelect
  },
  setup() {
    const { user, signOut } = useAuth();

    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const initials = computed(() =>
      `${firstName.value[0]}${lastName.value[0]}`.toUpperCase()
    );
    watchEffect(() => {
      if (user.value) {
        firstName.value = user.value.firstName;
        lastName.value = user.value.lastName;
        email.value = user.value.email;
      }
    });

    return {
      // References
      email,
      firstName,
      initials,
      lastName,
      // Methods
      signOut
    };
  }
};
</script>

<style scoped lang="scss" src="./UserMenu.scss"></style>
