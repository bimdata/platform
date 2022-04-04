<template>
  <div class="space-selected flex items-center">
    <div class="m-r-24 flex items-center">
      <span class="m-r-12 primary-font-bold" style="white-space: nowrap">
        {{ $t("SpaceSelected.selectedOrga") }}
      </span>
      <BIMDataTextbox maxWidth="160px" :text="space.organization.name" />
    </div>
    <div class="flex items-center">
      <span class="m-r-12 primary-font-bold" style="white-space: nowrap">
        {{ $t("SpaceSelected.selectedSpace") }}
      </span>
      <BIMDataTextbox maxWidth="160px" :text="space.name" />
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
