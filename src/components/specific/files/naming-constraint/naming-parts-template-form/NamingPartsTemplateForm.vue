<template>
  <div class="naming-parts-template-form">
    <div class="naming-parts-template-form__header">
      <BIMDataIllustration
        name="createList"
        :x="115"
        :y="115"
        :customWidth="110"
        :customHeight="110"
      />
      <span class="naming-parts-template-form__header__title">
        {{
          $t(
            `NamingConstraint.${
              isUpdate ? "updateTemplateTitle" : "createTemplateTitle"
            }`
          )
        }}
      </span>
    </div>

    <section class="naming-parts-template-form__step">
      <div class="naming-parts-template-form__step__head">
        <span class="naming-parts-template-form__step__num">1</span>
        <span class="naming-parts-template-form__step__label">
          {{ $t("NamingConstraint.listNameStep") }}
        </span>
      </div>
      <BIMDataInput
        width="100%"
        margin="0"
        :placeholder="$t('NamingConstraint.listNamePlaceholder')"
        :error="hasInvalidName"
        :errorMessage="$t('t.invalidName')"
        v-model="name"
      />
    </section>

    <section class="naming-parts-template-form__step">
      <div class="naming-parts-template-form__step__head">
        <span class="naming-parts-template-form__step__num">2</span>
        <span class="naming-parts-template-form__step__label">
          {{ $t("NamingConstraint.addElementsStep") }}
        </span>
      </div>

      <div
        v-for="(element, index) in elements"
        :key="index"
        class="naming-parts-template-form__element"
      >
        <BIMDataInput
          width="100%"
          margin="0"
          :placeholder="$t('NamingConstraint.elementNamePlaceholder')"
          :modelValue="element"
          @update:modelValue="value => updateElement(index, value)"
        />
        <BIMDataButton
          color="high"
          outline
          radius
          :disabled="elements.length === 1"
          @click="removeElement(index)"
        >
          {{ $t("NamingConstraint.removeElementButton") }}
        </BIMDataButton>
      </div>

      <div v-if="hasInvalidElements" class="naming-parts-template-form__error">
        {{ $t("NamingConstraint.emptyElementsError") }}
      </div>

      <BIMDataButton
        class="naming-parts-template-form__add"
        color="primary"
        fill
        radius
        @click="addElement"
      >
        <BIMDataIconPlus size="xxxs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.addElementButton") }}
      </BIMDataButton>
    </section>

    <div class="naming-parts-template-form__actions">
      <BIMDataButton ghost radius @click="cancel">
        {{ $t("t.cancel") }}
      </BIMDataButton>
      <BIMDataButton
        color="primary"
        fill
        radius
        :disabled="localState.loading"
        @click="submit"
      >
        <BIMDataIconList size="xs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.saveListButton") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref, watch } from "vue";
import { useNamingConstraints } from "../../../../../state/naming-constraints.js";
import { debounce } from "../../../../../utils/async.js";

export default {
  setup() {
    const { createNamingPartsTemplate, updateNamingPartsTemplate } =
      useNamingConstraints();

    const localState = inject("localState");

    const isUpdate = computed(() => !!localState.template);

    const name = ref("");
    const elements = ref([""]);
    const hasInvalidName = ref(false);
    const hasInvalidElements = ref(false);

    watch(
      () => localState.template,
      template => {
        name.value = template?.name ?? "";
        const values = template?.elements ?? [];
        elements.value = values.length > 0 ? [...values] : [""];
        hasInvalidName.value = false;
        hasInvalidElements.value = false;
      },
      { immediate: true }
    );

    const cleanElements = () =>
      elements.value.map(element => element.trim()).filter(Boolean);

    const updateElement = (index, value) => {
      elements.value.splice(index, 1, value);
    };

    const addElement = () => {
      elements.value.push("");
    };

    const removeElement = index => {
      elements.value.splice(index, 1);
      if (elements.value.length === 0) {
        elements.value.push("");
      }
    };

    const cancel = () => {
      localState.template = null;
      localState.currentView = "templates-list";
    };

    const submit = debounce(async () => {
      const values = cleanElements();
      hasInvalidName.value = !name.value;
      hasInvalidElements.value = values.length === 0;
      if (hasInvalidName.value || hasInvalidElements.value) {
        return;
      }
      try {
        localState.loading = true;
        const payload = { name: name.value, elements: values };
        let template;
        if (isUpdate.value) {
          template = await updateNamingPartsTemplate(
            localState.project,
            localState.template,
            payload
          );
          localState.templates = localState.templates.map(item =>
            item.id === template.id ? template : item
          );
        } else {
          template = await createNamingPartsTemplate(
            localState.project,
            payload
          );
          localState.templates = [...localState.templates, template];
        }
        cancel();
      } finally {
        localState.loading = false;
      }
    }, 500);

    return {
      // References
      localState,
      isUpdate,
      name,
      elements,
      hasInvalidName,
      hasInvalidElements,
      // Methods
      updateElement,
      addElement,
      removeElement,
      cancel,
      submit
    };
  }
};
</script>

<style scoped lang="scss">
.naming-parts-template-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    &__title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-primary);
    }
  }

  &__step {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
    border-radius: 8px;
    background-color: var(--color-silver-light);

    &__head {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &__num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: var(--color-primary);
      color: var(--color-white);
      font-size: 12px;
    }

    &__label {
      font-weight: 600;
      color: var(--color-primary);
    }
  }

  &__element {
    display: flex;
    align-items: flex-end;
    gap: 12px;
  }

  &__add {
    align-self: flex-start;
  }

  &__error {
    font-size: 12px;
    color: var(--color-high);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
