<template>
  <div class="group-member-selection-card">
    <transition name="fade" mode="out-in">
      <div v-if="loading" class="group-member-selection-card__loader">
        <BIMDataSpinner />
      </div>

      <template v-else-if="showSelector">
        <div class="group-member-selection-card__selector">
          <div class="group-member-selection-card__selector__title">
            {{ $t("GroupMemberSelectionCard.title") }}
            <BIMDataButton ghost rounded icon @click.stop="closeSelector">
              <BIMDataIcon name="close" size="xxs" />
            </BIMDataButton>
          </div>
          <BIMDataSelect
            class="group-member-selection-card__selector__input"
            :label="$t('GroupMemberSelectionCard.selectorLabel')"
            :multi="true"
            :options="users"
            optionKey="firstname"
            v-model="members"
          />
          <div class="group-member-selection-card__selector__actions">
            <BIMDataButton width="80px" ghost radius @click="closeSelector">
              {{ $t("GroupMemberSelectionCard.cancelButtonText") }}
            </BIMDataButton>
            <BIMDataButton
              width="80px"
              color="primary"
              fill
              radius
              @click="submit"
            >
              {{ $t("GroupMemberSelectionCard.submitButtonText") }}
            </BIMDataButton>
          </div>
        </div>
      </template>

      <template v-else>
        <div
          data-test="btn-open-create"
          class="group-member-selection-card__btn-open"
          @click="openSelector"
        >
          <div class="group-member-selection-card__btn-open__icon">
            <BIMDataIcon name="plus" size="l" />
          </div>
          <div class="group-member-selection-card__btn-open__text">
            {{ $t("GroupMemberSelectionCard.text") }}
          </div>
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";
import { useGroups } from "@/state/groups";

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: true
    },
    users: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const { updateGroupMembers } = useGroups();

    const loading = ref(false);
    const members = ref(props.group.members);

    const submit = async () => {
      try {
        console.log("Members: ", members.value);
        loading.value = true;
        await updateGroupMembers(props.project, props.group, members.value);
        closeSelector();
      } catch (error) {
        // TODO
      } finally {
        loading.value = false;
      }
    };

    const showSelector = ref(false);
    const openSelector = () => {
      showSelector.value = true;
    };
    const closeSelector = () => {
      showSelector.value = false;
    };

    return {
      // References
      loading,
      members,
      showSelector,
      // Methods
      closeSelector,
      openSelector,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupMemberSelectionCard.scss"></style>
