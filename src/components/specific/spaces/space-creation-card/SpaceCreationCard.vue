<template>
  <BIMDataCard
    data-test-id="space-creation-card"
    class="space-creation-card"
    :submenuText="$t('SpaceCreationCard.title')"
  >
    <template #right>
      <BIMDataButton
        data-test-id="btn-close-create"
        ghost
        rounded
        icon
        v-show="!loading"
        @click="close"
      >
        <BIMDataIconClose size="xxxs" />
      </BIMDataButton>
    </template>
    <template #content>
      <transition name="fade" mode="out-in">
        <template v-if="loading">
          <div class="action-loader">
            <BIMDataSpinner />
          </div>
        </template>

        <template v-else>
          <div class="creation-form">
            <BIMDataInput
              ref="nameInput"
              data-test-id="input-create-name"
              :placeholder="$t('t.name')"
              v-model="newSpace.name"
              :error="hasError"
              :errorMessage="$t('t.invalidName')"
              @keyup.esc.stop="close"
              @keyup.enter.stop="submit"
            />
            <BIMDataButton
              data-test-id="btn-submit-create"
              fill
              radius
              color="primary"
              @click="submit"
            >
              {{ $t("t.create") }}
            </BIMDataButton>
          </div>
        </template>
      </transition>
    </template>
  </BIMDataCard>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useSpaces } from "../../../../state/spaces.js";
import { debounce } from "../../../../utils/async.js";

const emit = defineEmits(["close"]);

const { createSpace } = useSpaces();

const loading = ref(false);
const nameInput = ref(null);
const newSpace = reactive({ name: "" });
const hasError = ref(false);

const submit = debounce(async () => {
  if (newSpace.name) {
    try {
      loading.value = true;
      await createSpace(newSpace);
      close();
    } finally {
      loading.value = false;
    }
  } else {
    nameInput.value.focus();
    hasError.value = true;
  }
}, 500);

const close = () => {
  newSpace.name = "";
  hasError.value = false;
  emit("close");
};

onMounted(() => {
  setTimeout(() => nameInput.value.focus(), 400);
});
</script>

<style scoped src="./SpaceCreationCard.css"></style>
