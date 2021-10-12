<template>
  <div data-test="space-board" class="view space-board">
    <ViewHeader class="space-board__header">
      <template #left>
        <AppBreadcrumb />
      </template>
      <template #center>
        <BIMDataSearch
          data-test="input-search"
          class="space-board__header__search"
          width="300px"
          :placeholder="$t('SpaceBoard.searchInputPlaceholder')"
          v-model="searchText"
          clear
        />
      </template>
      <template #right>
        <div class="flex items-center">
          <div class="flex" v-if="isSpacePay">
            <ProgressBar class="m-r-12" :progressPercent="calcSize">
              <template #text-left-below
                >Using {{ formatBytes(spaceSize.smart_data_size) }} from
                {{ formatBytes(spaceSize.smart_data_size_available) }}</template
              >
            </ProgressBar>
            <BIMDataButton
              color="secondary"
              fill
              radius
              @click="goToPaddlePayment"
              class="m-r-18"
            >
              {{ $t("SpaceBoard.upgradeStorageButton") }}
            </BIMDataButton>
          </div>
          <div class="flex" v-else>
            <ProgressBar class="m-r-12" :progressPercent="calcSize">
              <template #text-left-below
                >Using {{ formatBytes(spaceSize.smart_data_size) }} from
                {{ formatBytes(spaceSize.smart_data_size_available) }}
                included</template
              >
            </ProgressBar>
            <BIMDataButton
              color="secondary"
              fill
              radius
              @click="goToPaddlePayment"
              class="m-r-18"
            >
              Passer à la platform pro
            </BIMDataButton>
          </div>
          <!-- <BIMDataButton
          data-test="btn-filter"
          class="space-board__header__btn-filter"
          fill
          squared
          icon
        >
          <BIMDataIcon name="filter" size="s" />
        </BIMDataButton> -->
          <BIMDataButton
            data-test="btn-sort"
            class="space-board__header__btn-sort m-r-12"
            fill
            squared
            icon
            @click="sortProjects"
          >
            <BIMDataIcon name="alphabeticalSort" size="s" />
          </BIMDataButton>
          <BIMDataButton
            data-test="btn-users"
            v-if="space.isAdmin"
            class="space-board__header__btn-users"
            fill
            squared
            icon
            @click="openUsersManager"
          >
            <BIMDataIcon name="addUser" size="s" />
          </BIMDataButton>
        </div>
      </template>
    </ViewHeader>
    <SidePanel :title="$t('SpaceUsersManager.title')">
      <SpaceUsersManager
        :space="space"
        :users="users"
        :invitations="invitations"
      />
    </SidePanel>

    <ResponsiveGrid itemWidth="320px">
      <ProjectCreationCard
        data-test="creation-card"
        v-if="space.isAdmin"
        :key="-1"
        :space="space"
      />
      <ProjectCard
        data-test="project-card"
        v-for="project in projects"
        :key="project.id"
        :project="project"
      />
    </ResponsiveGrid>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

import { useRouter } from "vue-router";
import { routeNames } from "@/router";

import { useListFilter } from "@/composables/list-filter";
import { useListSort } from "@/composables/list-sort";
import { useSidePanel } from "@/composables/side-panel";
import { usePayment } from "@/state/payment.js";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";

import { formatBytes } from "@/utils/formatBytes.js";
// Components
import ProgressBar from "@/components/generic/progress-bar/ProgressBar";
import ResponsiveGrid from "@/components/generic/responsive-grid/ResponsiveGrid";
import SidePanel from "@/components/generic/side-panel/SidePanel";
import ViewHeader from "@/components/generic/view-header/ViewHeader";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import ProjectCard from "@/components/specific/projects/project-card/ProjectCard";
import ProjectCreationCard from "@/components/specific/projects/project-creation-card/ProjectCreationCard";
import SpaceUsersManager from "@/components/specific/users/space-users-manager/SpaceUsersManager";

export default {
  components: {
    ProgressBar,
    ResponsiveGrid,
    SidePanel,
    ViewHeader,
    AppBreadcrumb,
    ProjectCard,
    ProjectCreationCard,
    SpaceUsersManager
  },
  setup() {
    const { currentSpace, spaceUsers, spaceInvitations, cloudSize } =
      useSpaces();
    const { spaceProjects } = useProjects();
    const { openSidePanel } = useSidePanel();
    const {
      retrievePlaformSubscriptions,
      retrieveOrganizationPlaformSubscriptions
    } = usePayment();
    const router = useRouter();

    const { filteredList: displayedProjects, searchText } = useListFilter(
      spaceProjects,
      project => project.name
    );

    const { sortToggle: sortProjects } = useListSort(
      displayedProjects,
      project => project.name
    );

    const organizationPlaformSubscriptions = ref([]);
    const platformSubscriptions = ref([]);
    const spaceSize = ref({});
    const cloudMap = ref([]);
    const currentOrganization = currentSpace.value.organization;
    const isSpacePay = ref(false);
    const calcSize = ref(Number);

    onMounted(async () => {
      organizationPlaformSubscriptions.value =
        await retrieveOrganizationPlaformSubscriptions(currentOrganization);
      cloudMap.value = organizationPlaformSubscriptions.value.map(
        organization => organization.cloud.id
      );
      // boolean for upgrade platform or pay platform pro
      isSpacePay.value = cloudMap.value.includes(currentSpace.value.id);
      platformSubscriptions.value = await retrievePlaformSubscriptions(
        currentOrganization,
        currentSpace.value
      );

      // cloud size value
      spaceSize.value = await cloudSize(currentSpace.value);
      spaceSize.value = JSON.parse(spaceSize.value);

      // calculation of the remaining size
      calcSize.value = 100 - spaceSize.value.remaining_smart_data_size_percent;
    });

    const goToPaddlePayment = () => {
      router.push({ name: routeNames.paddlePayment });
    };

    return {
      // References
      invitations: spaceInvitations,
      projects: displayedProjects,
      searchText,
      space: currentSpace,
      users: spaceUsers,
      organizationPlaformSubscriptions,
      cloudMap,
      isSpacePay,
      spaceSize,
      formatBytes,
      calcSize,
      // Methods
      openUsersManager: openSidePanel,
      sortProjects,
      goToPaddlePayment
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceBoard.scss"></style>
