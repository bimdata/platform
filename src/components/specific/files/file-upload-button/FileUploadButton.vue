<template>
  <BIMDataButton
    class="file-upload-button"
    :width="width"
    :height="height"
    :color="color"
    fill
    radius
    :disabled="disabled"
    @click="selectFile"
  >
    <slot>
      <BIMDataIcon
        :name="icon"
        :rotate="iconRotate"
        :size="iconSize"
        margin="0 6px 0 0"
      />
      <template v-if="textButton">
        <span>{{ textButton }}</span>
      </template>
      <template v-else>
        <span>{{ $t("FileUploadButton.addFileButtonText") }}</span>
      </template>
    </slot>
    <input
      hidden
      ref="fileInput"
      type="file"
      :multiple="multiple"
      :accept="accept.join(',')"
      @change="uploadFile"
    />
  </BIMDataButton>
</template>

<script>
import { ref } from "vue";
import { usePaiementModal } from "@/components/specific/files/files-manager/files-paiement-modal/paiement-modal.js";

export default {
  props: {
    width: {
      type: String,
      default: "32px"
    },
    height: {
      type: String,
      default: "32px"
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: "primary"
    },
    textButton: {
      type: String
    },
    icon: {
      type: String,
      default: "addFile"
    },
    iconRotate: {
      type: Number,
      default: 0
    },
    iconSize: {
      type: String,
      default: "xs"
    },
    isSpaceFull: {
      type: Boolean,
      default: true
    }
  },
  emits: ["upload"],
  setup(props, { emit }) {
    const { openPaiementModal } = usePaiementModal();
    const fileInput = ref(null);

    const selectFile = () => {
      if (props.isSpaceFull) {
        openPaiementModal();
        return;
      }
      fileInput.value.click();
    };

    const uploadFile = event => {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        fileInput.value.value = "";
        emit("upload", files);
      }
    };

    return {
      // References
      fileInput,
      // Methods
      selectFile,
      uploadFile
    };
  }
};
</script>
