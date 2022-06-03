<template>
  <div ref="tagsMain" class="tags-main">
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
            :tagsMain="tagsMain"
            :tag="tag"
            @tag-updater="tagToUpdate = $event"
            @fetch-tags="$emit('fetch-tags')"
            @file-updated="$emit('file-updated')"
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
import TagService from "@/services/TagService";
import { useFiles } from "@/state/files.js";

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
  emits: ["close", "fetch-tags", "file-updated"],
  setup(props, { emit }) {
    const { getDocument } = useFiles();
    const { isOpen: showAddTagInput, toggle: toggleAddTagInput } = useToggle();

    const tagsDocument = ref(null);
    const tagsMain = ref(null);

    const input = ref(null);

    watch(showAddTagInput, () =>
      setTimeout(() => showAddTagInput.value && input.value.focus(), 100)
    );

    const newTagName = ref("");

    const addNewTag = async () => {
      if (newTagName.value) {
        await TagService.createTag(props.project, {
          name: newTagName.value,
          color: getRandomHexColor()
        });
        newTagName.value = "";
        toggleAddTagInput();
        emit("file-updated");
        emit("fetch-tags");
      }
    };

    const updatedTagList = ref(null);
    const filter = ref("");

    const getTagListUpdated = (list = updatedTagList.value) => {
      updatedTagList.value = list
        .map(tag => {
          return {
            ...tag,
            isFindable:
              filter.value === ""
                ? true
                : tag.name.includes(filter.value.toLowerCase()),
            isSelected: tagsDocument?.value.some(t => t.id === tag.id)
          };
        })
        .sort((a, b) => (a.id > b.id ? 1 : -1));
    };

    const tagToUpdate = ref(null);

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
      emit("file-updated");
    });

    watch(
      () => props.allTags,
      async () => {
        await getTagListUpdated(props.allTags);
      }
    );
    watch(filter, async () => getTagListUpdated());

    onMounted(async () => {
      tagsDocument.value = props.document.tags || [];
      await getTagListUpdated(props.allTags);
    });

    return {
      // references
      input,
      filter,
      tagsMain,
      newTagName,
      tagToUpdate,
      tagsDocument,
      updatedTagList,
      showAddTagInput,
      // methods
      toggleAddTagInput,
      addNewTag
    };
  }
};
</script>

<style scoped lang="scss" src="./TagsMain.scss"></style>
