<template>
  <div class="flex items-center">
    <span class="primary-font-bold m-r-12">Organization selected :</span>
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
          {{ selectedOrga.name }}
        </div>
      </template>
      <template #element="{ element }">
        {{ element.name }}
      </template>
    </BIMDataDropdownList>
  </div>
  <div class="flex items-center">
    <span class="primary-font-bold m-r-12">Space selected :</span>
    <BIMDataDropdownList
      :list="spaces"
      :perPage="6"
      elementKey="dropdown"
      :closeOnElementClick="true"
      @element-click="$emit('spaceClick', $event)"
    >
      <template #header>
        <div class="flex items-center">
          <img
            alt="organization icon"
            src="/static/space-icon.svg"
            class="m-r-12"
          />
          {{ selectedSpace.name }}
        </div>
      </template>
      <template #element="{ element }">
        {{ element.name }}
      </template>
    </BIMDataDropdownList>
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
