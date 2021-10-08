<template>
  <div class="organization-spaces-import">
    <div class="organization-spaces-import__header">
      <BIMDataButton ghost radius :disabled="loading" @click="close">
        <BIMDataIcon name="arrow" size="xxs" margin="0 6px 0 0" />
        <span>{{ $t("OrganizationSpacesImport.backButtonText") }}</span>
      </BIMDataButton>
      <TextBox :text="organization.name" :maxLength="24" />
      <BIMDataButton ghost rounded icon :disabled="loading" @click="closePanel">
        <BIMDataIcon name="close" size="xxs" fill color="tertiary-dark" />
      </BIMDataButton>
    </div>

    <transition name="fade" mode="out-in">
      <template v-if="loading">
        <div class="organization-spaces-import__loader">
          <BIMDataSpinner />
        </div>
      </template>

      <template v-else-if="isSuccess">
        <div class="organization-spaces-import__success">
          <img
            class="organization-spaces-import__success__image"
            src="/static/organization-form-success.svg"
          />
          <div class="organization-spaces-import__success__title">
            {{ $t("OrganizationSpacesImport.successTitle") }}
          </div>
          <div class="organization-spaces-import__success__message">
            {{ $t("OrganizationSpacesImport.successMessage") }}
          </div>
          <BIMDataButton
            width="120px"
            color="primary"
            fill
            radius
            @click="reset"
          >
            {{ $t("OrganizationSpacesImport.successButtonText") }}
          </BIMDataButton>
        </div>
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
import { computed, ref } from "vue";
import { useOrganizations } from "@/state/organizations.js";
// Components
import SpaceCardImage from "@/components/specific/spaces/space-card/space-card-image/SpaceCardImage.vue";

export default {
  components: {
    SpaceCardImage
  },
  props: {
    organization: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "close-panel"],
  setup(props, { emit }) {
    const {
      userOrganizations,
      getOrganizationSpaces,
      importOrganizationSpaces
    } = useOrganizations();

    const spaces = computed(() => {
      return userOrganizations.value.reduce(
        (acc, orga) =>
          acc.concat(
            orga.id === props.organization.id ? [] : getOrganizationSpaces(orga)
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
        loading.value = true;
        await importOrganizationSpaces(props.organization, [
          ...selection.value.values()
        ]);
      } finally {
        loading.value = false;
      }
    };

    const loading = ref(false);
    const isSuccess = ref(false);

    const reset = () => {
      loading.value = false;
      isSuccess.value = false;
      selection.value = new Map();
    };
    const close = () => {
      reset();
      emit("close");
    };
    const closePanel = () => {
      reset();
      emit("close-panel");
    };

    return {
      // References
      isSuccess,
      loading,
      selection,
      spaces,
      // Methods
      close,
      closePanel,
      reset,
      submit,
      toggle
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationSpacesImport.scss"></style>
