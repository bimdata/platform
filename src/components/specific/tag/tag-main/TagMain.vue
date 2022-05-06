<template>
  <div class="tag-main">
    <div class="tag-main__content">
      <div class="tag-main__content__header">
        <div class="tag-main__content__header__left-side">
          <BIMDataIcon
            name="cursor"
            fill
            color="primary"
            size="s"
            margin="2.5px 0 0 0"
          />
          <span>{{ $t("Tag.title") }}</span>
        </div>
        <div class="tag-main__content__header__right-side">
          <BIMDataButton ghost rounded icon @click="$emit('close')">
            <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
          </BIMDataButton>
        </div>
      </div>
      <div class="tag-main__content__list-add">
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
        <div class="tag-main__content__list-add__input-btn">
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
      <div class="tag-main__content__search-bar">
        <BIMDataSearch
          v-model="filter"
          :placeholder="$t('Tag.search')"
          color="primary"
          radius
          width="100%"
          height="calc(var(--spacing-unit) * 2.5)"
        />
      </div>
      <div class="tag-main__content__tag-list">
        <template v-for="(tag, index) of updatedTagList" :key="index">
          <TagList
            v-if="tag.isFindable"
            :project="project"
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
import { ref, watch } from "vue";
import { getRandomHexColor } from "@/components/generic/color-selector/colors.js";
import TagList from "@/components/specific/tag/tag-list/TagList.vue";
import { useToggle } from "@/composables/toggle";
import { useTag } from "@/state/tag.js";

export default {
  components: { TagList },

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
      default: () => [
        {
          id: 1,
          name: "tag1",
          color: "red"
        },
        {
          id: 2,
          name: "tag2",
          color: "red"
        },
        {
          id: 3,
          name: "tag3",
          color: "red"
        }
      ]
    }
  },
  emits: ["close", "fetch-tags"],
  setup(props, { emit }) {
    const filter = ref("");
    const updatedTagList = ref(null);
    const tagToUpdate = ref(null);
    const input = ref(null);
    const newTagName = ref("");

    const { createTag } = useTag();
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
      updatedTagList.value = list.map(tag => {
        return {
          ...tag,
          isFindable:
            filter.value === ""
              ? true
              : tag.name.includes(filter.value.toLowerCase())
        };
      });
    };

    watch(tagToUpdate, () => {
      updatedTagList.value.map(tag => {
        if (tag.id === tagToUpdate.value.id) {
          return {
            ...tagToUpdate.value
          };
        } else {
          return {
            ...tag
          };
        }
      });
    });

    watch(filter, () => getTagListUpdated());
    watch(
      () => props.allTags,
      async () => await getTagListUpdated(props.allTags),
      {
        immediate: true
      }
    );

    return {
      //references
      filter,
      input,
      updatedTagList,
      tagToUpdate,
      showAddTagInput,
      toggleAddTagInput,
      newTagName,
      //methods
      addNewTag
    };
  }
};
</script>

<style scoped lang="scss" src="./TagMain.scss"></style>
