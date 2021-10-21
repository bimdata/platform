<template>
  <div class="paddle-payment">
    <div class="paddle-payment__header flex items-center">
      <GoBackButton />
      <h1 v-if="spaceInformation.isPlatformPaid" class="text-center">
        Ajout de DataPack
      </h1>
      <h1 v-else class="text-center">Passer à la platforme professionnelle</h1>
    </div>
    <div class="paddle-payment__selectors justify-center m-y-24">
      <div class="flex items-center">
        <span class="primary-font-bold m-r-12">Organization selected :</span>
        <BIMDataDropdownList
          :list="organizationsList"
          :perPage="6"
          elementKey="dropdown"
          :closeOnElementClick="true"
          @element-click="onOrganizationClick($event)"
        >
          <template #header>
            <div class="flex items-center">
              <img
                alt="organization icon"
                src="/static/organization-icon.svg"
                class="m-r-12"
              />
              {{ selectedOrganization.name }}
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
          :list="spacesList"
          :perPage="6"
          elementKey="dropdown"
          :closeOnElementClick="true"
          @element-click="onSpaceClick($event)"
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
    </div>
    <div class="paddle-payment__payment">
      <div class="paddle-payment__payment__left">left</div>
      <div class="paddle-payment__payment__center paddle-container"></div>
      <div class="paddle-payment__payment__right">right</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";

import { useSpaces } from "@/state/spaces";
import { useOrganizations } from "@/state/organizations.js";
import { usePayment } from "@/state/payment.js";

// Components
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton";
export default {
  components: {
    GoBackButton
  },
  setup() {
    const { retrieveUserOrganizations, retrieveOrganizationSpaces } =
      useOrganizations();

    const { retrieveSpaceInformation } = usePayment();
    const { currentSpace } = useSpaces();

    const organizationsList = ref([]);
    const spacesList = ref([]);
    const selectedSpace = ref(currentSpace.value);
    const selectedOrganization = ref(currentSpace.value.organization);

    const onOrganizationClick = organization =>
      (selectedOrganization.value = organization);
    const onSpaceClick = space => (selectedSpace.value = space);

    const spaceInformation = ref({});

    onMounted(async () => {
      organizationsList.value = await retrieveUserOrganizations();
      organizationsList.value.sort((a, b) =>
        a.created_at > b.created_at ? -1 : 1
      );
    });

    watch(
      () => selectedOrganization.value,
      async () => {
        spacesList.value = await retrieveOrganizationSpaces(
          selectedOrganization.value
        );
        selectedSpace.value = spacesList.value[0];
      }
    );

    watch(
      () => selectedSpace.value,
      async () => {
        spaceInformation.value = await retrieveSpaceInformation(
          selectedSpace.value
        );
      }
    );

    return {
      currentSpace,
      organizationsList,
      spacesList,
      selectedOrganization,
      selectedSpace,
      spaceInformation,
      // Methods
      onOrganizationClick,
      onSpaceClick
    };
  }
};
</script>

<style scoped lang="scss" src="./SpacePayment.scss"></style>
