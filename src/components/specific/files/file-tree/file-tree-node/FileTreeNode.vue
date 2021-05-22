<script>
import { h } from "@vue/runtime-core";
import FileTreeNodeTemplate from "./FileTreeNodeTemplate";

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
  render() {
    const file = this.$props.file;
    const depth = this.$props.depth;

    const children = (file.children || []).filter(
      child => child.type === "Folder"
    );

    const node = h(
      FileTreeNodeTemplate,
      {
        key: file.id,
        file,
        depth,
        hasChildren: children.length > 0
      },
      {
        default() {
          return children.map(child =>
            h(FileTreeNode, { file: child, depth: depth + 1 })
          );
        }
      }
    );

    return node;
  }
};

export default FileTreeNode;
</script>
