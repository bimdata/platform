<template>
  <BIMDataMenuInline :isSubmenuRight="false" :isClickAway="true">
    <template #submenu>
      <div class="flex items-center justify-center">
        <BIMDataButton
          data-test-id="btn-open-update"
          ghost
          rounded
          icon
          @click="$emit('open-update')"
          class="m-r-6"
        >
          <BIMDataIcon name="edit" size="xxs" />
        </BIMDataButton>
        <BIMDataButton
          data-test-id="btn-open-delete"
          ghost
          rounded
          icon
          @click="$emit('open-delete')"
        >
          <BIMDataIcon name="delete" size="xxs" />
        </BIMDataButton>
      </div>
    </template>
  </BIMDataMenuInline>
</template>

<script>
export default {
  emits: ["open-update", "open-delete"]
};
</script>
