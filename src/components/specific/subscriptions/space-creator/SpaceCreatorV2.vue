<template>
  <div class="space-creator">
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
          {{ orga.name }}
        </div>
      </div>
      <BIMDataButton width="120px" color="primary" fill radius>
        {{ $t("SpaceCreator.billingAccountButton") }}
      </BIMDataButton>
    </div>
    <BIMDataButton
      width="100%"
      color="secondary"
      fill
      radius
      :disabled="!newSpace.name"
      @click="submit"
    >
      {{ $t("SpaceCreator.submitButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from "vue";
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
      required: true
    }
  },
  emits: ["space-created"],
  setup(props, { emit }) {
    const { createSpace } = useSpaces();

    const orga = ref({});

    const spaceNameInput = ref(null);
    const newSpaceLoading = ref(false);
    const newSpace = reactive({
      name: "",
      organizationId: null
    });

    const submit = async () => {
      try {
        newSpaceLoading.value = true;

        newSpace.organizationId = orga.value.id;

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

    watch(
      () => props.initialOrga,
      initialOrga => (orga.value = initialOrga),
      { immediate: true }
    );

    onMounted(() => {
      setTimeout(() => spaceNameInput.value.focus(), 200);
    });

    return {
      // References
      newSpace,
      newSpaceLoading,
      orga,
      spaceNameInput,
      // Methods
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceCreatorV2.scss"></style>
