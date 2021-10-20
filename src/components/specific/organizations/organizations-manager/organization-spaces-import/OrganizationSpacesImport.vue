<template>
  <div class="organization-spaces-import">
    <transition name="fade" mode="out-in">
      <template v-if="isSuccess">
        <OrganizationImportSuccess @close="reset" />
      </template>

      <template v-else>
        <div class="organization-spaces-import__content">
          <div class="list-title">
            {{ $t("OrganizationSpacesImport.spaceListTitle") }}
          </div>

          <div class="list-container">
            <div class="list-item" v-for="space of spaces" :key="space.id">
              <BIMDataCheckbox
                :modelValue="selection.has(space.id)"
                @update:modelValue="toggle(space, $event)"
              />
              <div class="organization-import-card">
                <div class="organization-import-card__image">
                  <SpaceCardImage :space="space" />
                </div>
                <div class="organization-import-card__info">
                  <TextBox
                    class="organization-import-card__info__name"
                    :text="space.name"
                    :maxLength="32"
                  />
                  <div class="organization-import-card__info__data">
                    {{ space.organization.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="list-placeholder" v-if="spaces.length === 0">
            {{ $t("OrganizationSpacesImport.spaceListPlaceholder") }}
          </div>

          <BIMDataButton
            v-else
            class="btn-submit"
            color="primary"
            fill
            radius
            :disabled="selection.size < 1"
            @click="submit"
          >
            {{ $t("OrganizationSpacesImport.submitButtonText") }}
          </BIMDataButton>
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
import { computed, inject, ref } from "vue";
import { useOrganizations } from "@/state/organizations.js";
// Components
import SpaceCardImage from "@/components/specific/spaces/space-card/space-card-image/SpaceCardImage.vue";
import OrganizationImportSuccess from "./organization-import-success/OrganizationImportSuccess.vue";

export default {
  components: {
    OrganizationImportSuccess,
    SpaceCardImage
  },
  setup() {
    const {
      userOrganizations,
      getOrganizationSpaces,
      importOrganizationSpaces
    } = useOrganizations();

    const localState = inject("localState");

    const isSuccess = ref(false);

    const reset = () => {
      localState.loading = false;
      isSuccess.value = false;
      selection.value = new Map();
      localState.currentView = "spaces-list";
    };

    const spaces = computed(() => {
      return userOrganizations.value.reduce(
        (acc, orga) =>
          acc.concat(
            orga.id === localState.organization.id
              ? []
              : getOrganizationSpaces(orga)
          ),
        []
      );
    });

    const selection = ref(new Map());

    const toggle = (space, checked) => {
      if (checked) {
        selection.value.set(space.id, space);
      } else {
        selection.value.delete(space.id);
      }
      selection.value = new Map([...selection.value.entries()]);
    };

    const submit = async () => {
      try {
        localState.loading = true;
        await importOrganizationSpaces(localState.organization, [
          ...selection.value.values()
        ]).then(() => (isSuccess.value = true));
      } finally {
        localState.loading = false;
      }
    };

    return {
      // References
      isSuccess,
      selection,
      spaces,
      // Methods
      reset,
      submit,
      toggle
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationSpacesImport.scss"></style>
