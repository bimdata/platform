<template>
  <div class="status_filter" v-click-away="close">
    <BIMDataButton
      class="status_filter__btn"
      fill
      squared
      icon
      @click="toggle"
    >
      <BIMDataIconFilterList size="s" />
    </BIMDataButton>
    <transition name="fade">
      <div v-show="isOpen" class="status_filter-menu p-y-12 p-x-18">
        <div
          v-for="status in computedStatuses"
          :key="status"
          class="status-filter-menu__item"
        >
          <BIMDataCheckbox
            :text="$t(`ProjectStatusBadge.${status}`)"
            :modelValue="selectedStatuses.includes(status)"
            @update:modelValue="(checked) => onStatusChange(status, checked)"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useToggle } from "../../../../composables/toggle.js";
import { projectStatus } from "../../../../utils/projects.js";

export default {
  name: "StatusFilter",
  props: {
    projects: {
      type: Array,
      required: true,
    },
  },
  emits: ["update:filteredProjects"],
  setup(props, { emit }) {
    const { isOpen, close, toggle } = useToggle();

    const selectedStatuses = ref([]);

    // Gestion du changement de statut
    const onStatusChange = (status, isChecked) => {
      if (isChecked) {
        if (!selectedStatuses.value.includes(status)) {
          selectedStatuses.value.push(status);
        }
      } else {
        selectedStatuses.value = selectedStatuses.value.filter((s) => s !== status);
      }
    };

    // Calcul des statuts uniques
    const computedStatuses = computed(() => {
      const statuses = new Set();
      props.projects.forEach((project) => {
        statuses.add(projectStatus(project));
      });
      return Array.from(statuses);
    });

    // Liste filtrée en fonction des statuts
    const filteredProjects = computed(() => {
      return props.projects.filter((project) => {
        if (selectedStatuses.value.length === 0) {
          return true;
        }
        return selectedStatuses.value.includes(projectStatus(project));
      });
    });

    // Émettre la liste filtrée à chaque changement
    watch(filteredProjects, (newFilteredProjects) => {
      emit("update:filteredProjects", newFilteredProjects);
    });

    return {
      isOpen,
      toggle,
      close,
      filteredProjects,
      selectedStatuses,
      computedStatuses,
      onStatusChange,
    };
  },
};
</script>

<style lang="scss">
.status_filter {
  position: relative;
  &-menu {
    top: calc(32px + 6px);
    right: 0;
    position: absolute;
    background-color: var(--color-white);
    line-height: 2;
  }
}
</style>