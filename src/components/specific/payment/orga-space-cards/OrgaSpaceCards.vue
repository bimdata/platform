<template>
  <div class="orga-space-cards flex m-t-18">
    <BIMDataCard class="orga-card text-center">
      <template #content>
        <div class="flex items-center justify-center">
          <img
            alt="organization icon"
            src="/static/organization-icon.svg"
            class="m-r-12"
          />
          <h3 class="color-primary">
            {{ $t("OrgaSpaceCards.createSelectOrgaTitle") }}
          </h3>
        </div>
        <div>
          <BIMDataRadio
            :text="$t('OrgaSpaceCards.createNewOrgaRadio')"
            id="newOrga"
            name="orga"
            value="newOrga"
            v-model="orgaChoice"
            :disabled="isSubmitOrga"
          >
          </BIMDataRadio>
          <BIMDataInput
            v-model="orgaName"
            :placeholder="$t('OrgaSpaceCards.createNewOrgaInput')"
            :error="hasOrgaInvalidName"
            errorMessage="orga error message here"
            :disabled="orgaChoice !== 'newOrga' || isSubmitOrga"
          >
          </BIMDataInput>
        </div>
        <div>
          <BIMDataRadio
            :text="$t('OrgaSpaceCards.selectOrgaRadio')"
            id="selectOrga"
            name="orga"
            value="selectOrga"
            v-model="orgaChoice"
            :disabled="isSubmitOrga"
          >
          </BIMDataRadio>
          <BIMDataDropdownList
            :list="organizations"
            :perPage="6"
            elementKey="dropdown"
            :disabled="orgaChoice !== 'selectOrga' || isSubmitOrga"
            :closeOnElementClick="true"
            @element-click="$emit('orgaClick', $event)"
            class="m-t-12"
            width="300px"
          >
            <template #header>{{ selectedOrga.name }}</template>
            <template #element="{ element }">
              {{ element.name }}
            </template>
          </BIMDataDropdownList>
        </div>
        <BIMDataButton
          color="primary"
          fill
          radius
          class="m-t-12"
          @click="submitOrga"
          :disabled="isSubmitOrga || isSubmitSpace"
          >{{ $t("OrgaSpaceCards.orgaValidateButton") }}</BIMDataButton
        >
      </template>
    </BIMDataCard>
    <BIMDataCard class="space-card text-center">
      <template #content>
        <div class="flex items-center justify-center">
          <img alt="space icon" src="/static/space-icon.svg" class="m-r-12" />
          <h3 class="color-primary">
            {{ $t("OrgaSpaceCards.createSpaceTitle") }}
          </h3>
        </div>
        <p>{{ $t("OrgaSpaceCards.createSpaceText") }}</p>
        <div>
          <BIMDataInput
            v-model="spaceName"
            :placeholder="$t('OrgaSpaceCards.createSpaceInput')"
            :error="hasSpaceInvalidName"
            errorMessage="space error message here"
            :disabled="!isSubmitOrga"
          >
          </BIMDataInput>
        </div>
        <BIMDataButton
          color="primary"
          fill
          radius
          class="m-t-12"
          @click="submitSpace"
          :disabled="!isSubmitOrga && spaceName === ''"
          >{{ $t("OrgaSpaceCards.spaceValidateButton") }}</BIMDataButton
        >
      </template>
    </BIMDataCard>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useOrganizations } from "@/state/organizations.js";
import { useSpaces } from "@/state/spaces";
import { useNotifications } from "@/composables/notifications";
import { useI18n } from "vue-i18n";

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
    }
  },
  emits: ["orgaClick"],
  setup(props) {
    const { createOrganization } = useOrganizations();
    const { createSpace } = useSpaces();
    const { pushNotification } = useNotifications();
    const { t } = useI18n();

    const isSubmitOrga = ref(false);
    const isSubmitSpace = ref(false);
    const hasOrgaInvalidName = ref(false);
    const hasSpaceInvalidName = ref(false);

    const orgaChoice = ref("newOrga");
    const orgaName = ref("");

    const spaceName = ref("");

    const newOrgaName = reactive({ name: "" });
    const newSpace = reactive({ name: "" });
    const newOrga = ref({});

    const submitOrga = async () => {
      if (orgaChoice.value === "newOrga") {
        if (!orgaName.value) {
          hasOrgaInvalidName.value = true;
          return;
        }
        try {
          newOrgaName.value = {
            name: orgaName.value
          };
          newOrga.value = await createOrganization(newOrgaName.value);
        } finally {
          isSubmitOrga.value = true;
        }
      } else {
        isSubmitOrga.value = true;
      }
    };
    const submitSpace = async () => {
      // if create a new organization
      if (orgaChoice.value === "newOrga") {
        if (!spaceName.value) {
          hasSpaceInvalidName.value = true;
          return;
        }
        try {
          newSpace.value = {
            name: spaceName.value,
            organizationId: newOrga.value.id
          };
          await createSpace(newSpace.value);
          pushNotification({
            type: "success",
            title: t("Success"),
            message: t("OrgaSpaceCards.spaceSuccessMessageNotification", {
              spaceName: newSpace.value.name,
              organizationName: newOrga.value.name
            })
          });
        } finally {
          isSubmitSpace.value = true;
        }
      }
      // if select an organization
      else {
        try {
          newSpace.value = {
            name: spaceName.value,
            organizationId: props.selectedOrga.id
          };
          await createSpace(newSpace.value);
          pushNotification({
            type: "success",
            title: t("Success"),
            message: t("OrgaSpaceCards.spaceSuccessMessageNotification", {
              spaceName: newSpace.value.name,
              organizationName: props.selectedOrga.name
            })
          });
        } finally {
          isSubmitSpace.value = true;
        }
      }
    };
    return {
      isSubmitOrga,
      isSubmitSpace,
      hasOrgaInvalidName,
      hasSpaceInvalidName,
      orgaChoice,
      orgaName,
      spaceName,
      // Methods
      submitOrga,
      submitSpace
    };
  }
};
</script>

<style scoped lang="scss" src="./OrgaSpaceCards.scss"></style>
