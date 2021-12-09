<template>
  <div class="space-creator flex m-t-18">
    <BIMDataCard class="orga-card">
      <template #content>
        <div class="flex items-center justify-center">
          <BIMDataIcon
            style="min-width: 22px"
            margin="2px 0 0 0"
            name="organization"
            size="m"
            fill
            color="primary"
          />
          <h3 class="text-center color-primary">
            {{ $t("SpaceCreator.createSelectOrgaTitle") }}
          </h3>
        </div>
        <div>
          <BIMDataRadio
            v-if="organizations.length > 0"
            :disabled="step !== 1"
            name="mode"
            value="create"
            :text="$t('SpaceCreator.createNewOrgaRadio')"
            v-model="mode"
          >
          </BIMDataRadio>
          <BIMDataInput
            :disabled="step !== 1 || mode !== 'create'"
            ref="orgaNameInput"
            :placeholder="$t('SpaceCreator.createNewOrgaInput')"
            :loading="newOrgaLoading"
            v-model="newOrga.name"
            @keyup.enter.stop="() => (newOrga.name ? submitOrga() : null)"
          />
        </div>
        <div v-if="organizations.length > 0">
          <BIMDataRadio
            :disabled="step !== 1"
            name="mode"
            value="select"
            :text="$t('SpaceCreator.selectOrgaRadio')"
            v-model="mode"
          >
          </BIMDataRadio>
          <BIMDataDropdownList
            :disabled="step !== 1 || mode === 'create'"
            class="m-t-12"
            width="300px"
            :list="organizations"
            :perPage="6"
            :closeOnElementClick="true"
            @element-click="orga = $event"
          >
            <template #header>
              <BIMDataTextBox
                maxWidth="220px"
                :text="orga.name"
                :tooltip="false"
              />
            </template>
            <template #element="{ element }">
              <BIMDataTextBox
                maxWidth="240px"
                :text="element.name"
                :tooltip="false"
              />
            </template>
          </BIMDataDropdownList>
        </div>
        <BIMDataButton
          :disabled="step !== 1 || (mode === 'create' && !newOrga.name)"
          class="m-t-12"
          color="primary"
          fill
          radius
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
            :disabled="step !== 2"
            ref="spaceNameInput"
            :placeholder="$t('SpaceCreator.createSpaceInput')"
            :loading="newSpaceLoading"
            v-model="newSpace.name"
            @keyup.enter.stop="() => (newSpace.name ? submitSpace() : null)"
          />
        </div>
        <BIMDataButton
          class="m-t-12"
          color="primary"
          fill
          radius
          :disabled="step !== 2 || !newSpace.name"
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
import { useOrganizations } from "@/state/organizations.js";
import { useSpaces } from "@/state/spaces.js";

export default {
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
      default: null
    }
  },
  emits: ["space-created"],
  setup(props, { emit }) {
    const { createOrganization } = useOrganizations();
    const { createSpace } = useSpaces();

    const mode = ref("create");
    const step = ref(1);
    const orga = ref({});

    const orgaNameInput = ref(null);
    const newOrgaLoading = ref(false);
    const newOrga = reactive({
      id: null,
      name: ""
    });

    const spaceNameInput = ref(null);
    const newSpaceLoading = ref(false);
    const newSpace = reactive({
      id: null,
      name: "",
      organization: null
    });

    const submitOrga = async () => {
      step.value = 2;
      setTimeout(() => spaceNameInput.value.focus(), 200);
    };

    const submitSpace = async () => {
      try {
        newSpaceLoading.value = true;

        if (mode.value === "create") {
          orga.value = await createOrganization(newOrga);
        }
        newSpace.organization = { id: orga.value.id };

        if (props.type === "free") {
          const createdSpace = await createSpace(newSpace);
          emit("space-created", createdSpace);
        } else {
          emit("space-created", { ...newSpace });
        }
        step.value = 3;
      } finally {
        newSpaceLoading.value = false;
      }
    };

    watch(
      [() => props.organizations, () => props.initialOrga],
      ([organizations, initialOrga]) => {
        if (organizations.length > 0) {
          mode.value = initialOrga ? "select" : "create";
          orga.value = initialOrga ?? organizations[0];
          if (initialOrga) submitOrga();
        } else {
          mode.value = "create";
          orga.value = {};
        }
      },
      { immediate: true }
    );

    watch(
      () => mode.value,
      () => {
        if (mode.value === "create") {
          setTimeout(() => orgaNameInput.value.focus(), 200);
        }
      },
      { immediate: true }
    );

    return {
      mode,
      newOrga,
      newOrgaLoading,
      newSpace,
      newSpaceLoading,
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
