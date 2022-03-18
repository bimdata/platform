<template>
  <li class="setting-card-item flex items-center justify-between p-x-12 m-b-6">
    <span v-if="!editExtension">{{
      extension[typeFieldMap[extensionType]]
    }}</span>
    <transition v-else>
      <BIMDataInput
        v-model="extensionValue"
        @keyup.enter.stop="submitValue"
        ref="input"
      />
    </transition>
    <div class="flex items-center">
      <BIMDataIcon
        v-if="!editExtension"
        name="edit"
        size="xxs"
        fill
        color="default"
        margin="0 12px 0 0"
        @click="editExtension = true"
      />
      <BIMDataIcon
        v-else
        name="close"
        size="xxs"
        fill
        color="default"
        margin="0 12px 0 0"
        @click="editExtension = false"
      />
      <BIMDataIcon
        name="delete"
        size="xxs"
        fill
        color="high"
        margin="0 12px 0 0"
        @click="isDeleteSafeZoneOpen = true"
      />

      <template v-if="typesWithColor.includes(extensionType)">
        <span
          class="setting-card-item__color"
          :style="{
            'background-color': `#${extensionColor}`,
            'border-color': adjustBorderColor(`${extensionColor}`, -50)
          }"
          @click="displayColorSelector = true"
        >
        </span>
        <ColorSelector
          v-if="displayColorSelector"
          class="setting-card-item__color-selector"
          :modelValue="extensionColor"
          @update:modelValue="submitColor"
          v-click-away="
            () => {
              displayColorSelector = false;
            }
          "
        />
      </template>

      <div
        class="setting-card-item__delete__safe-zone flex items-center justify-between p-x-12"
        v-if="isDeleteSafeZoneOpen"
      >
        <p>Supprimer cette {{ extensionType }}</p>
        <div class="flex items-center">
          <BIMDataButton
            color="high"
            fill
            radius
            height="28px"
            class="m-r-6"
            @click="submitDelete(extension)"
          >
            Supprimer
          </BIMDataButton>
          <BIMDataButton
            color="primary"
            ghost
            rounded
            icon
            @click="isDeleteSafeZoneOpen = false"
          >
            <BIMDataIcon name="close" size="xxxs" />
          </BIMDataButton>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import { ref, watch } from "vue";
import { adjustBorderColor } from "../adjustColor.js";
import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";

import ColorSelector from "@/components/generic/color-selector/ColorSelector.vue";

const typeFieldMap = {
  Stage: "stage",
  Priority: "priority",
  Label: "label",
  Type: "topicType",
  Status: "topicStatus"
};

const typesWithColor = ["Status", "Priority"];

export default {
  props: {
    extension: {
      type: Object
    },
    extensionType: {
      type: String
    }
  },

  components: {
    ColorSelector
  },

  setup(props) {
    const { currentProject } = useProjects();
    const { updateExtension, deleteExtension } = useBcf();

    const editExtension = ref(false);
    const displayColorSelector = ref(false);
    const isDeleteSafeZoneOpen = ref(false);

    const input = ref(null);
    watch(editExtension, () =>
      setTimeout(() => editExtension.value && input.value.focus(), 50)
    );

    const extensionValue = ref(
      props.extension[typeFieldMap[props.extensionType]]
    );
    const submitValue = async () => {
      if (
        extensionValue.value !==
        props.extension[typeFieldMap[props.extensionType]]
      ) {
        const data = {};
        data[typeFieldMap[props.extensionType]] = extensionValue.value;

        await updateExtension(
          currentProject.value,
          props.extensionType,
          props.extension.id,
          data
        );
        editExtension.value = false;
      }
    };

    const extensionColor = ref(props.extension.color);
    const submitColor = async colorValue => {
      if (colorValue !== props.extension.color) {
        await updateExtension(
          currentProject.value,
          props.extensionType,
          props.extension.id,
          {
            color: colorValue
          }
        );
        extensionColor.value = colorValue;
      }
    };

    const submitDelete = async extension => {
      await deleteExtension(
        currentProject.value,
        props.extensionType,
        extension
      );
    };

    return {
      input,
      extensionValue,
      extensionColor,
      displayColorSelector,
      editExtension,
      isDeleteSafeZoneOpen,
      submitValue,
      submitColor,
      submitDelete,
      adjustBorderColor,
      typeFieldMap,
      typesWithColor
    };
  }
};
</script>

<style scoped lang="scss" src="./Extension.scss"></style>
