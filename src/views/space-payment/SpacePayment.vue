<template>
  <div class="paddle-payment">
    <div class="paddle-payment__header flex items-center">
      <GoBackButton />
      <h1 v-if="spaceInformation.isPlatformPaid" class="text-center">
        Ajout de DataPack
      </h1>
      <h1 v-else class="text-center">Passer à la platforme professionnelle</h1>
    </div>
    <div class="paddle-payment__content justify-center m-y-24">
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

    const organizationsList = ref([]);
    const spacesList = ref([]);
    const selectedOrganization = ref("");
    const selectedSpace = ref("");

    const onOrganizationClick = organization =>
      (selectedOrganization.value = organization);
    const onSpaceClick = space => (selectedSpace.value = space);

    const spaceInformation = ref({});

    const { currentSpace } = useSpaces();

    watch(
      () => selectedOrganization.value,
      async () => {
        spacesList.value = await retrieveOrganizationSpaces(
          selectedOrganization.value
        );
        selectedSpace.value = spacesList.value[0];
      }
    );

    onMounted(async () => {
      organizationsList.value = await retrieveUserOrganizations();
      organizationsList.value.sort((a, b) =>
        a.created_at > b.created_at ? -1 : 1
      );
      selectedOrganization.value = currentSpace.value.organization;

      selectedSpace.value = currentSpace.value;

      spaceInformation.value = await retrieveSpaceInformation(
        currentSpace.value
      );

      async () => {
        spaceInformation.value = await retrieveSpaceInformation(
          currentSpace.value
        );
      },
        Paddle.Product.Prices(12403, function (prices) {
          // TODO: set price with with function instead of hard coded value
          console.log(prices);
        });
      // const response = await (
      //   await fetch(
      //     `http://localhost:8000/payment/organization/${currentSpace.value.organization.id}/generate-api-subscription`,
      //     {
      //       method: "POST",
      //       headers: {
      //         "content-type": "application/json",
      //         authorization: `Bearer ${accessToken.value}`
      //       },
      //     }
      //   )
      // ).json();
      // const response = await (
      //   await fetch(
      //     `http://localhost:8000/payment/organization/${currentSpace.value.organization.id}/cloud/${currentSpace.id}/generate-platform-subscription`,
      //     {
      //       method: "POST",
      //       headers: {
      //         "content-type": "application/json",
      //         authorization: `Bearer ${accessToken.value}`
      //       }
      //     }
      //   )
      // ).json();
      // console.log(response);
      Paddle.Checkout.open({
        method: "inline",
        product: 12403,
        email: "gaelle@bimdata.io",
        // title: "MY TITLE",
        // message: "MY MESSAGE",
        disableLogout: true,
        // passthrough: {
        //   organization_id: "1663",
        //   cloud_id: "673"
        // },
        frameTarget: "paddle-container",
        frameInitialHeight: 416,
        frameStyle:
          "width:100%; min-width:312px; background-color: transparent; border: none;",
        referring_domain: "platform self service",
        displayModeTheme: "light"
      });
    });

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
