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
      <BIMDataCard class="create-select-orga text-center">
        <template #content>
          <h3 class="color-primary">Create or select an orga</h3>
          <div>
            <BIMDataRadio
              text="Create a new orga"
              id="newOrga"
              value="newOrga"
              v-model="organizationChoice"
            >
            </BIMDataRadio>
            <BIMDataInput
              v-model="organizationName"
              placeholder="Nom de ma nouvelle orga"
              :error="!organizationName"
              errorMessage="organization error message here"
              :disabled="organizationChoice !== 'newOrga'"
            >
            </BIMDataInput>
          </div>
          <div>
            <BIMDataRadio
              text="Select an orga"
              id="selectOrga"
              value="selectOrga"
              v-model="organizationChoice"
            >
            </BIMDataRadio>
            <BIMDataDropdownList
              :list="organizationsList"
              :perPage="6"
              elementKey="dropdown"
              :disabled="organizationChoice !== 'selectOrga'"
              :closeOnElementClick="true"
              @element-click="onOrganizationClick($event)"
              class="m-t-12"
            >
              <template #header>{{ selectedOrganization.name }}</template>
              <template #element="{ element }">
                {{ element.name }}
              </template>
            </BIMDataDropdownList>
          </div>
          <BIMDataButton color="primary" fill radius class="m-t-12"
            >Valider</BIMDataButton
          >
        </template>
      </BIMDataCard>
      <BIMDataCard class="create-space text-center">
        <template #content>
          <h3 class="color-primary">Create a space</h3>
          <p>lorem ipsum dolor sit amet, con</p>
          <div>
            <BIMDataInput
              v-model="spaceName"
              placeholder="Nom de mon espace"
              :error="!spaceName"
              errorMessage="space error message here"
              :disabled="!organizationName"
            >
            </BIMDataInput>
          </div>
          <BIMDataButton color="primary" fill radius class="m-t-12"
            >Valider</BIMDataButton
          >
        </template>
      </BIMDataCard>
    </div>
    <div class="paddle-payment__payment">
      <div class="paddle-payment__payment__left">left</div>
      <div class="paddle-payment__payment__center paddle-container"></div>
      <div class="paddle-payment__payment__right">right</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

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
    const { retrieveUserOrganizations } = useOrganizations();

    const { retrieveSpaceInformation } = usePayment();

    const organizationChoice = ref("newOrga");
    const organizationName = ref("");

    const organizationsList = ref([]);
    const selectedOrganization = ref("");
    const onOrganizationClick = organization =>
      (selectedOrganization.value = organization);

    const spaceInformation = ref({});

    const { currentSpace } = useSpaces();
    onMounted(async () => {
      async () => {
        spaceInformation.value = await retrieveSpaceInformation(
          currentSpace.value
        );
      },
        (organizationsList.value = await retrieveUserOrganizations());
      organizationsList.value.sort((a, b) =>
        a.created_at > b.created_at ? -1 : 1
      );
      selectedOrganization.value = organizationsList.value[0];

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
      organizationChoice,
      organizationName,
      selectedOrganization,
      spaceInformation,
      // Methods
      onOrganizationClick
    };
  }
};
</script>

<style scoped lang="scss" src="./Payment.scss"></style>
