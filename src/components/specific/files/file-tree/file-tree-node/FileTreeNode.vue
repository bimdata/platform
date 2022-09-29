<script>
import { h, ref, watch } from "vue";
import { FILE_TYPE } from "../../../../../config/files.js";

import FileTreeNodeTemplate from "./FileTreeNodeTemplate.vue";

let FileTreeNode;

FileTreeNode = {
  props: {
    file: {
      type: Object,
      required: true
    },
    depth: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const children = ref([]);
    watch(
      () => props.file,
      () => {
        children.value = (props.file.children || [])
          .filter(child => child.type === FILE_TYPE.FOLDER)
          .sort((a, b) => (a.name < b.name ? -1 : 1));
      },
      { immediate: true }
    );

    return () =>
      h(
        FileTreeNodeTemplate,
        {
          key: props.file.id,
          file: props.file,
          depth: props.depth,
          hasChildren: children.value.length > 0,
          isOpen: props.depth === 0
        },
        {
          default() {
            return children.value.map(child =>
              h(FileTreeNode, { file: child, depth: props.depth + 1 })
            );
          }
        }
      );
  }
};

export default FileTreeNode;
</script>
