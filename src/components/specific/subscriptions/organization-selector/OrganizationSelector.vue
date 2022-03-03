<template>
  <div class="organization-selector">
    <div class="organization-selector__title">
      <BIMDataIcon name="organization" size="m" fill color="primary" />
      <h2>{{ $t("OrganizationSelector.title") }}</h2>
    </div>
    <div class="organization-selector__select">
      <BIMDataRadio
        name="mode"
        value="select"
        :text="$t('OrganizationSelector.radioLabelSelect')"
        v-model="mode"
      >
      </BIMDataRadio>
      <BIMDataDropdownList
        :disabled="mode === 'create'"
        class="m-t-12"
        width="300px"
        :list="organizations"
        :perPage="6"
        :closeOnElementClick="true"
        @element-click="orga = $event"
      >
        <template #header>
          <BIMDataTextbox maxWidth="220px" :text="orga.name" :tooltip="false" />
        </template>
        <template #element="{ element }">
          <BIMDataTextbox
            maxWidth="240px"
            :text="element.name"
            :tooltip="false"
          />
        </template>
      </BIMDataDropdownList>
    </div>
    <div class="organization-selector__create">
      <BIMDataRadio
        name="mode"
        value="create"
        :text="$t('OrganizationSelector.radioLabelCreate')"
        v-model="mode"
      >
      </BIMDataRadio>
      <BIMDataInput
        :disabled="mode !== 'create'"
        ref="orgaNameInput"
        style="width: 300px"
        :placeholder="$t('OrganizationSelector.inputPlaceholder')"
        :loading="newOrgaLoading"
        v-model="newOrga.name"
        @keyup.enter.stop="() => newOrga.name && submit()"
      />
    </div>
    <BIMDataButton
      :disabled="mode === 'create' && !newOrga.name"
      width="300px"
      color="primary"
      fill
      radius
      @click="submit"
    >
      {{ $t("OrganizationSelector.submitButtonText") }}
    </BIMDataButton>

    <!-- Creation success message -->
    <div class="organization-selector__success" v-show="isSuccess">
      <OrganizationFormSuccessImage
        class="organization-selector__success__image"
      />
      <div class="organization-selector__success__text">
        {{ $t("OrganizationSelector.successMessage") }}
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useOrganizations } from "@/state/organizations.js";
import { delay } from "@/utils/async.js";

export default {
  props: {
    organizations: {
      type: Array,
      required: true
    },
    initialOrga: {
      type: Object
    }
  },
  emits: ["orga-selected"],
  setup(props, { emit }) {
    const { createOrganization } = useOrganizations();

    const mode = ref("select");
    const orga = ref(props.initialOrga);

    const orgaNameInput = ref(null);
    const newOrgaLoading = ref(false);
    const newOrga = reactive({ name: "" });

    const isSuccess = ref(false);

    const submit = async () => {
      try {
        newOrgaLoading.value = true;
        if (mode.value === "create") {
          orga.value = await createOrganization(newOrga);
          isSuccess.value = true;
          await delay(2000); // wait 2s before continuing
        }
        emit("orga-selected", orga.value);
      } finally {
        newOrga.name = "";
        newOrgaLoading.value = false;
        isSuccess.value = false;
      }
    };

    return {
      // Reference
      isSuccess,
      mode,
      newOrga,
      newOrgaLoading,
      orga,
      orgaNameInput,
      // Methods
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationSelector.scss"></style>
