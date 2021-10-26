<template>
  <div class="orga-space-selectors flex items-center">
    <div class="flex items-center m-r-24">
      <span class="primary-font-bold m-r-12">{{
        $t("OrgaSpaceSelectors.organizationSelected")
      }}</span>
      <BIMDataDropdownList
        :list="organizations"
        :perPage="6"
        elementKey="dropdown"
        :closeOnElementClick="true"
        @element-click="$emit('orgaClick', $event)"
      >
        <template #header>
          <div class="flex items-center">
            <img
              alt="organization icon"
              src="/static/organization-icon.svg"
              class="m-r-12"
            />
            <span class="m-r-6">{{ selectedOrga.name }}</span>
          </div>
        </template>
        <template #element="{ element }">
          {{ element.name }}
        </template>
      </BIMDataDropdownList>
    </div>
    <div class="flex items-center" v-if="spaces && spaces.length">
      <span class="primary-font-bold m-r-12">{{
        $t("OrgaSpaceSelectors.spaceSelected")
      }}</span>
      <BIMDataDropdownList
        :list="spaces"
        :perPage="6"
        elementKey="dropdown"
        :closeOnElementClick="true"
        @element-click="$emit('spaceClick', $event)"
      >
        <template #header>
          <div class="flex items-center">
            <img alt="space icon" src="/static/space-icon.svg" class="m-r-12" />
            <span class="m-r-6">{{ selectedSpace.name }}</span>
          </div>
        </template>
        <template #element="{ element }">
          {{ element.name }}
        </template>
      </BIMDataDropdownList>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    organizations: {
      type: Array,
      required: true
    },
    spaces: {
      type: Array,
      required: true
    },
    selectedOrga: {
      type: Object,
      required: true
    },
    selectedSpace: {
      type: Object,
      required: true
    }
  },
  emits: ["orgaClick", "spaceClick"]
};
</script>

<style scoped lang="scss" src="./OrgaSpaceSelectors.scss"></style>
