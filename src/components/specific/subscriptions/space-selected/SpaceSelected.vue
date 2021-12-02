<template>
  <div class="space-selected flex items-center">
    <div class="m-r-24 flex items-center">
      <span class="m-r-12 primary-font-bold">
        {{ $t("SpaceSelected.selectedOrga") }}
      </span>
      <TextBox :text="space.organization.name" :maxLength="56" />
    </div>
    <div class="flex items-center">
      <span class="m-r-12 primary-font-bold">
        {{ $t("SpaceSelected.selectedSpace") }}
      </span>
      <TextBox :text="space.name" :maxLength="56" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    space: {
      type: Object,
      required: true
    }
  }
};
</script>
