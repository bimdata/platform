<template>
  <div class="setting-card p-12 m-y-12">
    <div
      class="setting-card__header flex items-center justify-between"
      @click="toggle"
    >
      <strong>{{ $t(`SettingCard.title.${extensionType}`) }}</strong>
      <div class="flex items-center">
        <div
          class="setting-card__header__length flex items-center justify-center m-r-30"
          v-if="availableExtensions"
        >
          <span>{{ availableExtensions.length }}</span>
        </div>
        <BIMDataIcon
          name="chevron"
          fill
          color="default"
          size="xxs"
          :rotate="isOpen ? 90 : 0"
        />
      </div>
    </div>
    <div v-show="isOpen">
      <div
        class="setting-card__subheader flex items-center justify-between m-t-6 m-b-12"
      >
        {{ $t(`SettingCard.text.${extensionType}`) }}
        <BIMDataButton color="default" fill radius @click="toggleAddExtension">
          <BIMDataIcon
            name="plus"
            fill
            color="default"
            size="xxxs"
            margin="0 6px 0 0"
          />
          <span>{{ $t("SettingCard.addButton") }}</span>
        </BIMDataButton>
      </div>
      <transition name="list">
        <div v-if="showAddExtension" class="m-b-12">
          <BIMDataInput
            ref="input"
            :placeholder="$t(`SettingCard.input.${extensionType}`)"
            v-model="newExtensionName"
            @keyup.enter.stop="addExtension"
          />

          <div class="flex items-center justify-end">
            <BIMDataButton
              ghost
              radius
              class="m-r-6"
              @click="closeAddExtension"
              >{{ $t("SettingCard.cancelButton") }}</BIMDataButton
            >
            <BIMDataButton color="primary" fill radius @click="addExtension">{{
              $t("SettingCard.validateButton")
            }}</BIMDataButton>
          </div>
        </div>
      </transition>
      <ul class="setting-card__content bimdata-list">
        <Extension
          v-for="extension in availableExtensions"
          :extensionType="extensionType"
          :extension="extension"
          :key="extension.id"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";
import { useToggle } from "@/composables/toggle";
import { getRandomHexColor } from "@/components/generic/color-selector/colors.js";

import Extension from "./Extension.vue";

const typeFieldMap = {
  Stage: "stage",
  Priority: "priority",
  Label: "label",
  Type: "topicType",
  Status: "topicStatus"
};

const typesWithColor = ["Status", "Priority"];
export default {
  components: {
    Extension
  },
  props: {
    availableExtensions: {
      type: Array
    },
    extensionType: {
      type: String
    }
  },
  setup(props) {
    const { isOpen, close, toggle } = useToggle();

    const { isOpen: showAddExtension, toggle: toggleAddExtension } =
      useToggle();

    const input = ref(null);
    watch(showAddExtension, () =>
      setTimeout(() => showAddExtension.value && input.value.focus(), 100)
    );

    const closeAddExtension = () => {
      newExtensionName.value = "";
      showAddExtension.value = false;
    };

    const { currentProject } = useProjects();
    const { createExtension } = useBcf();
    const newExtensionName = ref("");
    const extensionValue = ref([typeFieldMap[props.extensionType]]);
    const addExtension = async () => {
      if (typesWithColor.includes(props.extensionType)) {
        const data = {
          [extensionValue.value]: newExtensionName.value,
          color: getRandomHexColor()
        };
        await createExtension(currentProject.value, props.extensionType, data);
        newExtensionName.value = "";
        showAddExtension.value = false;
      } else {
        const data = {
          [extensionValue.value]: newExtensionName.value
        };
        await createExtension(currentProject.value, props.extensionType, data);
        newExtensionName.value = "";
        showAddExtension.value = false;
      }
    };

    return {
      input,
      isOpen,
      toggle,
      showAddExtension,
      newExtensionName,
      typeFieldMap,
      typesWithColor,
      // methods
      close,
      closeAddExtension,
      toggleAddExtension,
      addExtension
    };
  }
};
</script>

<style scoped lang="scss" src="./SettingCard.scss"></style>
