<template>
  <div class="space-creator flex m-t-18">
    <BIMDataCard class="orga-card text-center">
      <template #content>
        <div class="flex items-center justify-center">
          <BIMDataIcon
            margin="2px 0 0 0"
            name="organization"
            size="m"
            fill
            color="primary"
          />
          <h3 class="color-primary">
            {{ $t("SpaceCreator.createSelectOrgaTitle") }}
          </h3>
        </div>
        <div>
          <BIMDataRadio
            name="mode"
            value="create"
            :text="$t('SpaceCreator.createNewOrgaRadio')"
            :disabled="step > 1"
            v-model="mode"
          >
          </BIMDataRadio>
          <BIMDataInput
            ref="orgaNameInput"
            :placeholder="$t('SpaceCreator.createNewOrgaInput')"
            :disabled="step > 1 || mode !== 'create'"
            v-model="newOrga.name"
          />
        </div>
        <div>
          <BIMDataRadio
            name="mode"
            value="select"
            :text="$t('SpaceCreator.selectOrgaRadio')"
            :disabled="step > 1"
            v-model="mode"
          >
          </BIMDataRadio>
          <BIMDataDropdownList
            class="m-t-12"
            width="300px"
            :list="organizations"
            :perPage="6"
            :closeOnElementClick="true"
            :disabled="step > 1 || mode === 'create'"
            @element-click="orga = $event"
          >
            <template #header>
              {{ orga.name }}
            </template>
            <template #element="{ element }">
              {{ element.name }}
            </template>
          </BIMDataDropdownList>
        </div>
        <BIMDataButton
          class="m-t-12"
          color="primary"
          fill
          radius
          :disabled="step > 1 || (mode === 'create' && !newOrga.name)"
          @click="submitOrga"
        >
          {{ $t("SpaceCreator.orgaValidateButton") }}
        </BIMDataButton>
      </template>
    </BIMDataCard>

    <BIMDataCard class="space-card text-center">
      <template #content>
        <div class="flex items-center justify-center">
          <BIMDataIcon
            margin="0 2px 2px 0"
            name="cloud"
            size="m"
            fill
            color="primary"
          />
          <h3 class="color-primary">
            {{ $t("SpaceCreator.createSpaceTitle") }}
          </h3>
        </div>
        <p>
          {{ $t("SpaceCreator.createSpaceText") }}
        </p>
        <div>
          <BIMDataInput
            ref="spaceNameInput"
            :placeholder="$t('SpaceCreator.createSpaceInput')"
            :disabled="step === 1"
            v-model="newSpace.name"
          />
        </div>
        <BIMDataButton
          class="m-t-12"
          color="primary"
          fill
          radius
          :disabled="step === 1 || !newSpace.name"
          @click="submitSpace"
        >
          {{ $t("SpaceCreator.spaceValidateButton") }}
        </BIMDataButton>
      </template>
    </BIMDataCard>
  </div>
</template>

<script>
import { ref, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useNotifications } from "@/composables/notifications.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSpaces } from "@/state/spaces.js";

export default {
  props: {
    organizations: {
      type: Array,
      required: true
    },
    initialOrga: {
      type: Object,
      default: null
    }
  },
  emits: ["space-created"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const { pushNotification } = useNotifications();
    const { createOrganization } = useOrganizations();
    const { createSpace } = useSpaces();

    const mode = ref("create");
    const step = ref(1);
    const orga = ref({});

    const orgaNameInput = ref(null);
    const spaceNameInput = ref(null);
    const newOrga = reactive({
      id: null,
      name: ""
    });
    const newSpace = reactive({
      id: null,
      name: "",
      organizationId: null
    });

    watch(
      () => mode.value,
      () => {
        if (mode.value === "create") {
          setTimeout(() => orgaNameInput.value.focus(), 200);
        }
      },
      { immediate: true }
    );
    watch(
      [() => props.organizations, () => props.initialOrga],
      ([organizations, initialOrga]) => {
        orga.value = initialOrga ?? organizations[0];
      },
      { immediate: true }
    );

    const submitOrga = async () => {
      if (mode.value === "create") {
        orga.value = await createOrganization(newOrga);
      }
      newSpace.organizationId = orga.value.id;
      step.value = 2;
      setTimeout(() => spaceNameInput.value.focus(), 200);
    };

    const submitSpace = async () => {
      const createdSpace = await createSpace(newSpace);
      step.value = 3;
      emit("space-created", createdSpace);
      pushNotification({
        type: "success",
        title: t("Success"),
        message: t("SpaceCreator.spaceSuccessMessageNotification", {
          organizationName: orga.value.name,
          spaceName: newSpace.name
        })
      });
    };

    return {
      mode,
      newOrga,
      newSpace,
      orga,
      orgaNameInput,
      spaceNameInput,
      step,
      // Methods
      submitOrga,
      submitSpace
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceCreator.scss"></style>
