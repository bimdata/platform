<template>
  <div class="tags-main">
    <div class="tags-main__content">
      <div class="tags-main__content__header">
        <div class="tags-main__content__header__left-side">
          <BIMDataIcon
            name="tag"
            fill
            color="primary"
            size="s"
            margin="2.5px 0 0 0"
          />
          <span>{{ $t("Tag.title") }}</span>
        </div>
        <div class="tags-main__content__header__right-side">
          <BIMDataButton ghost rounded icon @click="$emit('close')">
            <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
          </BIMDataButton>
        </div>
      </div>
      <div class="tags-main__content__list-add">
        <span>{{ $t("Tag.list") }}</span>
        <BIMDataButton
          color="primary"
          radius
          ghost
          icon
          margin="12px"
          @click="showAddTagInput = true"
        >
          <BIMDataIcon
            name="close"
            size="xxxs"
            margin="0 calc(var(--spacing-unit) / 2) 0 var(--spacing-unit)"
            :rotate="45"
          />
          <span>{{ $t("Tag.addTag") }}</span>
        </BIMDataButton>
      </div>
      <template v-if="showAddTagInput">
        <BIMDataInput
          ref="input"
          :placeholder="$t('Tag.addNewTag')"
          v-model="newTagName"
          @keyup.enter.stop="addNewTag"
        />
        <div class="tags-main__content__list-add__input-btn">
          <BIMDataButton
            ghost
            radius
            class="m-r-6"
            @click="toggleAddTagInput"
            >{{ $t("Tag.cancel") }}</BIMDataButton
          >
          <BIMDataButton color="primary" fill radius @click="addNewTag">{{
            $t("Tag.validate")
          }}</BIMDataButton>
        </div>
      </template>
      <div class="tags-main__content__search-bar">
        <BIMDataSearch
          v-model="filter"
          :placeholder="$t('Tag.search')"
          color="primary"
          radius
          width="100%"
          height="calc(var(--spacing-unit) * 2.5)"
        />
      </div>
      <div class="tags-main__content__tag-list">
        <template v-for="tag of updatedTagList" :key="tag.id">
          <TagsItem
            v-if="tag.isFindable"
            :project="project"
            :document="document"
            :tag="tag"
            @tag-updater="tagToUpdate = $event"
            @fetch-tags="$emit('fetch-tags')"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { getRandomHexColor } from "@/components/generic/color-selector/colors.js";
import TagsItem from "@/components/specific/tags/tags-item/TagsItem.vue";
import { useToggle } from "@/composables/toggle";
import { useFiles } from "@/state/files.js";
import { useTag } from "@/state/tag.js";

export default {
  components: { TagsItem },

  props: {
    project: {
      type: Object,
      required: true
    },
    document: {
      type: Object,
      required: true
    },
    allTags: {
      type: Array,
      default: () => []
    }
  },
  emits: ["close", "fetch-tags"],
  setup(props, { emit }) {
    const filter = ref("");
    const tagsDocument = ref(null);
    const updatedTagList = ref(null);
    const tagToUpdate = ref(null);
    const input = ref(null);
    const newTagName = ref("");

    const { createTag } = useTag();
    const { getDocument } = useFiles();

    const { isOpen: showAddTagInput, toggle: toggleAddTagInput } = useToggle();

    watch(showAddTagInput, () =>
      setTimeout(() => showAddTagInput.value && input.value.focus(), 100)
    );

    const addNewTag = async () => {
      if (newTagName.value) {
        await createTag(props.project, {
          name: newTagName.value,
          color: getRandomHexColor()
        });
        newTagName.value = "";
        toggleAddTagInput();
        emit("fetch-tags");
      }
    };

    const getTagListUpdated = (list = updatedTagList.value) => {
      updatedTagList.value = list
        .map(tag => {
          return {
            ...tag,
            isFindable:
              filter.value === ""
                ? true
                : tag.name.includes(filter.value.toLowerCase()),
            isSelected:
              tagsDocument.value &&
              tagsDocument.value.some(t => t.id === tag.id)
          };
        })
        .sort((a, b) => (a.id > b.id ? 1 : -1));
    };

    watch(tagToUpdate, async () => {
      updatedTagList.value.map(tag =>
        tag.id === tagToUpdate.value.id
          ? {
              ...tagToUpdate.value
            }
          : {
              ...tag
            }
      );
      tagsDocument.value = (
        await getDocument(props.project, props.document)
      ).tags;
    });

    watch(
      () => props.allTags,
      async () => {
        await getTagListUpdated(props.allTags);
      }
    );
    watch(filter, async () => getTagListUpdated());

    onMounted(async () => {
      tagsDocument.value = (
        await getDocument(props.project, props.document)
      ).tags;
      await getTagListUpdated(props.allTags);
    });

    return {
      //references
      filter,
      input,
      updatedTagList,
      tagToUpdate,
      showAddTagInput,
      toggleAddTagInput,
      newTagName,
      tagsDocument,
      //methods
      addNewTag
    };
  }
};
</script>

<style scoped lang="scss" src="./TagsMain.scss"></style>
