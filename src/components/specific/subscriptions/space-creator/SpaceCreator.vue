<template>
  <div class="space-creator" :class="{ disabled }">
    <div class="space-creator__title">
      <BIMDataIcon name="cloud" size="m" fill color="primary" />
      <h2>{{ $t("SpaceCreator.title") }}</h2>
    </div>
    <div class="space-creator__text">
      {{ $t("SpaceCreator.text") }}
    </div>
    <div class="space-creator__input">
      <BIMDataInput
        ref="spaceNameInput"
        :placeholder="$t('SpaceCreator.inputPlaceholder')"
        :loading="newSpaceLoading"
        :disabled="disabled"
        v-model="newSpace.name"
        @keyup.enter.stop="() => newSpace.name && submit()"
      />
    </div>
    <div class="space-creator__billing-account">
      <div>
        <div class="billing-account-label">
          {{ $t("SpaceCreator.billingAccountLabel") }}
        </div>
        <div class="billing-account-name">
          <BIMDataTextbox maxWidth="220px" :text="orga.name" />
        </div>
      </div>
      <BIMDataButton
        width="120px"
        color="primary"
        fill
        radius
        :disabled="disabled"
        @click="openBillingAccountModal"
      >
        {{ $t("SpaceCreator.billingAccountButton") }}
      </BIMDataButton>
    </div>
    <BIMDataButton
      width="100%"
      color="secondary"
      fill
      radius
      :disabled="disabled || !newSpace.name"
      @click="submit"
    >
      {{ $t("SpaceCreator.submitButtonText") }}
    </BIMDataButton>

    <AppModal>
      <OrganizationSelector
        :organizations="organizations"
        :initialOrga="initialOrga"
        @orga-selected="updateOrga"
      />
    </AppModal>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useSpaces } from "@/state/spaces.js";
import { useAppModal } from "@/components/specific/app/app-modal/app-modal.js";
// Components
import AppModal from "@/components/specific/app/app-modal/AppModal.vue";
import OrganizationSelector from "@/components/specific/subscriptions/organization-selector/OrganizationSelector.vue";

export default {
  components: {
    AppModal,
    OrganizationSelector
  },
  props: {
    type: {
      type: String,
      default: "pro",
      validator: value => ["free", "pro"].includes(value)
    },
    organizations: {
      type: Array,
      required: true
    },
    initialOrga: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["space-created"],
  setup(props, { emit }) {
    const { openModal, closeModal } = useAppModal();
    const { createSpace } = useSpaces();

    const orga = ref(props.initialOrga);

    const spaceNameInput = ref(null);
    const newSpaceLoading = ref(false);
    const newSpace = reactive({ name: "" });

    const openBillingAccountModal = () => {
      openModal();
    };

    const updateOrga = organization => {
      orga.value = organization;
      closeModal();
    };

    const submit = async () => {
      try {
        newSpaceLoading.value = true;

        // TODO: Try to fix/improve
        // Here we set both `organizationId` and `organization.id`
        // because they are both used elsewhere in the code.
        // Setting only one of the two would break in some cases.
        // More specifically:
        //  - `organizationId` is needed in POST call to create a new space attached to the right orga
        //  - `organization.id` is used in other methods (state/services) to access space orga
        newSpace.organizationId = orga.value.id;
        newSpace.organization = { id: orga.value.id };

        if (props.type === "free") {
          const createdSpace = await createSpace(newSpace);
          emit("space-created", createdSpace);
        } else {
          emit("space-created", { ...newSpace });
        }
      } finally {
        newSpaceLoading.value = false;
      }
    };

    onMounted(() => {
      setTimeout(() => spaceNameInput.value.focus(), 200);
    });

    return {
      // References
      newSpace,
      newSpaceLoading,
      openBillingAccountModal,
      orga,
      spaceNameInput,
      // Methods
      submit,
      updateOrga
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceCreator.scss"></style>
