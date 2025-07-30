<template>
  <div class="group-card flex items-center m-b-12">
    <BIMDataCheckbox
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      margin="0 12px 0 0"
    />
    <div
      class="group-card__content p-6 flex items-center justify-between"
      :style="{ 'border-left': `7px solid ${group.color}` }"
    >
      <div class="flex items-center">
        <BIMDataIconGroup fill color="default" margin="0 6px 0 0" />
        {{ group.name }}
      </div>
      <UserAvatarList
        class="folder-permission-selector__users"
        :users="group.members"
        itemGap="18"
      />
    </div>
  </div>
</template>

<script setup>
import UserAvatarList from "../../../users/user-avatar-list/UserAvatarList.vue";
defineProps({
  group: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
});
defineEmits(["update:modelValue"]);
</script>

<style scoped src="./GroupCard.css"></style>
