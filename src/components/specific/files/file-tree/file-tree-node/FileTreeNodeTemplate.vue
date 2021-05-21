<template>
  <div class="file-tree-node">
    <div class="file-tree-node__node">
      <BIMDataIcon
        class="file-tree-node__node__icon-arrow"
        name="chevron"
        size="xxs"
        :rotate="isOpen ? 90 : 0"
        :style="{
          visibility: hasChildren ? 'visible' : 'hidden'
        }"
        @click="toggle"
      />
      <BIMDataIcon
        class="file-tree-node__node__icon-folder"
        :name="isOpen ? 'folderOpen' : 'folder'"
        size="s"
      />
      <span class="file-tree-node__node__name" @click="select">
        {{ file.name }}
      </span>
    </div>
    <transition name="fade">
      <div class="file-tree-node__children" v-show="isOpen">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { inject } from "@vue/runtime-core";
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
    }
  },
  setup(props) {
    const isOpen = ref(false);
    const selectFile = inject("selectFile");

    const toggle = () => {
      if (props.hasChildren) {
        isOpen.value = !isOpen.value;
      }
    };

    const select = () => {
      selectFile(props.file);
    };

    return {
      // References
      isOpen,
      // Methods
      toggle,
      select
    };
  }
};
</script>
