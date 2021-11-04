<template>
  <div class="space-selector flex items-center">
    <div class="m-r-24 flex items-center">
      <span class="m-r-12 primary-font-bold">
        {{ $t("SpaceSelector.orgaSelectorLabel") }}
      </span>
      <BIMDataDropdownList
        :list="organizations"
        :perPage="6"
        :closeOnElementClick="true"
        @element-click="selectedOrga = $event"
      >
        <template #header>
          <div class="flex items-center">
            <BIMDataIcon
              name="organization"
              size="m"
              fill
              color="primary"
              margin="6px 2px 0 0"
            />
            <span class="m-r-6">
              {{ selectedOrga.name }}
            </span>
          </div>
        </template>
        <template #element="{ element }">
          {{ element.name }}
        </template>
      </BIMDataDropdownList>
    </div>
    <div class="flex items-center" v-if="spaces && spaces.length">
      <span class="m-r-12 primary-font-bold">
        {{ $t("SpaceSelector.spaceSelectorLabel") }}
      </span>
      <BIMDataDropdownList
        :list="spaces"
        :perPage="6"
        :closeOnElementClick="true"
        @element-click="selectedSpace = $event"
      >
        <template #header>
          <div class="flex items-center">
            <BIMDataIcon
              name="cloud"
              size="m"
              fill
              color="primary"
              margin="0 6px 0 0"
            />
            <span class="m-r-6">
              {{ selectedSpace.name }}
            </span>
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
import { ref, watch } from "vue";
import { useOrganizations } from "@/state/organizations.js";

export default {
  props: {
    organizations: {
      type: Array,
      required: true
    },
    initialOrga: {
      type: Object,
      default: () => {}
    },
    initialSpace: {
      type: Object,
      default: () => {}
    }
  },
  emits: ["space-selected"],
  setup(props, { emit }) {
    const { getOrganizationSpaces } = useOrganizations();

    const selectedOrga = ref({});
    const selectedSpace = ref({});
    const spaces = ref([]);

    watch(
      [
        () => props.organizations,
        () => props.initialOrga,
        () => props.initialSpace
      ],
      ([organizations, initialOrga, initialSpace]) => {
        selectedOrga.value = initialOrga || organizations[0];
        spaces.value = getOrganizationSpaces(selectedOrga.value);
        selectedSpace.value = initialSpace || spaces.value[0] || {};
      },
      { immediate: true }
    );

    watch(
      () => selectedOrga.value,
      orga => {
        spaces.value = getOrganizationSpaces(orga);
        selectedSpace.value = spaces.value[0] ?? {};
      }
    );
    watch(
      () => selectedSpace.value,
      space => emit("space-selected", space)
    );

    return {
      // References
      selectedOrga,
      selectedSpace,
      spaces
    };
  }
};
</script>
