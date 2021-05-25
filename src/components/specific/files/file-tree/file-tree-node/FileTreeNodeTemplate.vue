<template>
  <div class="file-tree-node">
    <div
      class="file-tree-node__node"
      :class="{ selected: selectedFileID === file.id }"
      :style="{ paddingLeft: `${depth * 18}px` }"
      @click="select"
    >
      <div class="file-tree-node__node__background"></div>
      <BIMDataIcon
        class="file-tree-node__node__icon-arrow"
        name="chevron"
        size="xxs"
        :rotate="showChildren ? 90 : 0"
        :style="{
          visibility: hasChildren ? 'visible' : 'hidden'
        }"
        @click.stop="toggle"
      />
      <BIMDataIcon
        class="file-tree-node__node__icon-folder"
        :name="showChildren ? 'folderOpen' : 'folder'"
        size="s"
      />
      <span class="file-tree-node__node__name">
        {{ file.name }}
      </span>
    </div>
    <transition name="fade">
      <div class="file-tree-node__children" v-show="showChildren">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import { inject, ref, watch } from "vue";
import { getDescendants } from "@/utils/file-structure";
// Components
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataIcon
  },
  props: {
    file: {
      type: Object,
      required: true
    },
    depth: {
      type: Number,
      default: 0
    },
    hasChildren: {
      type: Boolean,
      default: false
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const showChildren = ref(false);
    const selectedFileID = inject("selectedFileID");
    const selectFile = inject("selectFile");

    watch(
      () => props.isOpen,
      () => (showChildren.value = props.isOpen),
      { immediate: true }
    );
    watch(
      () => selectedFileID.value,
      fileID => {
        if (
          props.hasChildren &&
          getDescendants(props.file).some(child => child.id === fileID)
        ) {
          showChildren.value = true;
        }
      }
    );

    const toggle = () => {
      if (props.hasChildren) {
        showChildren.value = !showChildren.value;
      }
    };

    const select = () => {
      selectFile(props.file);
    };

    return {
      // References
      selectedFileID,
      showChildren,
      // Methods
      toggle,
      select
    };
  }
};
</script>
