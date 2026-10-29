<template>
  <section class="models-overview">
    <header class="models-overview__header">
      <BIMDataIconIfcFile size="xs" color="primary" />
      <span class="models-overview__header__title">
        {{ $t("ModelsOverview.title") }}
      </span>
      <div class="models-overview__header__meta">
        <span v-if="images.length > 1" class="models-overview__header__index">
          {{ image.index }} / {{ images.length }}
        </span>
        <div
          v-if="isProjectAdmin(project) && images.length > 0"
          v-click-away="closeMenu"
          class="models-overview__header__menu"
        >
          <BIMDataButton data-test-id="btn-preview-actions" ripple rounded icon @click="toggleMenu">
            <BIMDataIconEllipsis size="m" />
          </BIMDataButton>
          <BIMDataMenu v-show="isOpenMenu" :menuItems="menuItems">
            <template #item="{ item }">
              <span>{{ item.text }}</span>
            </template>
          </BIMDataMenu>
        </div>
      </div>
    </header>

    <template v-if="models.length > 0 && image">
      <div class="models-overview__preview" data-guide="preview-ifc">
        <AppLink
          class="models-overview__preview__open"
          data-test-id="btn-open-viewer"
          :data-test-param="currentModel && currentModel.id"
          :to="viewerRoute"
        >
          <BIMDataButton
            color="primary"
            fill
            rounded
            :disabled="!currentModel || currentModel.status !== 'C'"
            padding="0 12px"
          >
            <BIMDataIconShow size="xxs" margin="0 6px 0 0" />
            <span>{{ $t("t.open") }}</span>
          </BIMDataButton>
        </AppLink>

        <template v-if="image.url">
          <BIMDataModelPreview
            class="models-overview__preview__viewer"
            :type="image.type === MODEL_TYPE.IFC ? '3d' : '2d'"
            :previewUrl="image.url"
            :width="360"
            :height="260"
            backgroundColor="transparent"
          />
        </template>
        <template v-else>
          <div class="models-overview__preview__placeholder">
            <BIMDataIcon :name="MODEL_CONFIG[image.type].icon" customSize="120" />
          </div>
        </template>

        <BIMDataIcon
          v-if="image.type"
          class="models-overview__preview__type-icon"
          :name="MODEL_CONFIG[image.type].icon"
          size="l"
        />
      </div>

      <footer class="models-overview__footer">
        <div class="models-overview__footer__name">
          <BIMDataTextbox :text="image.name" tooltipPosition="top" />
        </div>
        <template v-if="images.length > 1">
          <BIMDataButton ghost rounded icon :disabled="image.index === 1" @click="prevImage">
            <BIMDataIconChevron size="xxs" :rotate="180" />
          </BIMDataButton>
          <BIMDataButton
            ghost
            rounded
            icon
            :disabled="image.index === images.length"
            @click="nextImage"
          >
            <BIMDataIconChevron size="xxs" />
          </BIMDataButton>
        </template>
      </footer>
    </template>

    <template v-else>
      <div class="models-overview__empty">
        <ModelsOverviewOnboarding @open-file-uploader="$emit('open-file-uploader')" />
      </div>
    </template>
  </section>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { MODEL_CONFIG, MODEL_TYPE } from "../../../../config/models.js";
import routeNames from "../../../../router/route-names.js";
import { useAppModal } from "../../app/app-modal/app-modal.js";
import { useToggle } from "../../../../composables/toggle.js";
import { useUser } from "../../../../state/user.js";
// Components
import AppLink from "../../app/app-link/AppLink.vue";
import MainModelSelector from "../models-card/main-model-selector/MainModelSelector.vue";
import ModelsOverviewOnboarding from "./models-overview-onboarding/ModelsOverviewOnboarding.vue";

export default {
  components: {
    AppLink,
    ModelsOverviewOnboarding,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    models: {
      type: Array,
      required: true,
    },
  },
  emits: ["model-changed", "open-file-uploader"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const { isProjectAdmin } = useUser();
    const { openModal, closeModal } = useAppModal();
    const { isOpen: isOpenMenu, close: closeMenu, toggle: toggleMenu } = useToggle();

    const images = ref([]);
    const image = ref({});
    const index = ref(0);

    const currentModel = computed(() => props.models[index.value] || null);

    const prevImage = () => {
      if (index.value > 0) index.value--;
    };
    const nextImage = () => {
      if (index.value < images.value.length - 1) index.value++;
    };

    const openPreviewSelector = () => {
      closeMenu();
      openModal({
        component: MainModelSelector,
        props: {
          project: props.project,
          models: props.models,
          onCancel: closeModal,
          onSuccess: closeModal,
        },
      });
    };

    const menuItems = computed(() => [
      {
        key: "select-preview",
        text: t("ModelsOverview.selectPreviewButton"),
        action: openPreviewSelector,
      },
    ]);

    const viewerRoute = computed(() => ({
      name: routeNames.modelViewer,
      params: {
        spaceID: props.project.cloud.id,
        projectID: props.project.id,
        modelIDs: currentModel.value?.id,
      },
      query: {
        window: currentModel.value ? MODEL_CONFIG[currentModel.value.type].window : undefined,
      },
    }));

    watch(index, (newIndex, oldIndex) => {
      if (newIndex !== oldIndex) {
        image.value = images.value[newIndex] || {};
        emit("model-changed", props.models[newIndex]);
      }
    });

    watch(
      () => props.models,
      () => {
        images.value = props.models.map((model, i) => ({
          index: i + 1,
          name: model.name,
          type: model.type,
          url: model.preview_file,
        }));

        index.value = 0;
        image.value = images.value.length > 0 ? images.value[0] : {};
        if (props.models[index.value]) {
          emit("model-changed", props.models[index.value]);
        }
      },
      { immediate: true },
    );

    return {
      // References
      currentModel,
      image,
      images,
      isOpenMenu,
      menuItems,
      MODEL_CONFIG,
      MODEL_TYPE,
      viewerRoute,
      // Methods
      closeMenu,
      isProjectAdmin,
      nextImage,
      prevImage,
      toggleMenu,
    };
  },
};
</script>

<style scoped lang="scss" src="./ModelsOverview.scss"></style>
