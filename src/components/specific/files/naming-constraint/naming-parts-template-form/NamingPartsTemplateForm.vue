<template>
  <div class="naming-parts-template-form__container flex flex-col justify-between">
    <div class="naming-parts-template-form flex flex-col items-center justify-between">
      <div class="naming-parts-template-form__header">
        <BIMDataIllustration
          name="createList"
          :x="115"
          :y="115"
          :customWidth="110"
          :customHeight="110"
        />
        <span class="naming-parts-template-form__header__title">
          {{ $t(`NamingConstraint.${isUpdate ? "updateTemplateTitle" : "createTemplateTitle"}`) }}
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
            :ref="
              (el) => {
                if (index === elements.length - 1) {
                  lastInput = el;
                }
              }
            "
            width="100%"
            margin="0"
            :placeholder="$t('NamingConstraint.elementNamePlaceholder')"
            :modelValue="element"
            @update:modelValue="(value) => updateElement(index, value)"
            @keyup.enter="index === elements.length - 1 && addElement()"
          />
          <BIMDataButton
            color="high"
            outline
            radius
            :disabled="elements.length === 0 || !element"
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
    </div>

    <div class="naming-parts-template-form__actions">
      <BIMDataButton ghost radius @click="cancel">
        {{ $t("t.cancel") }}
      </BIMDataButton>
      <BIMDataButton color="primary" fill radius :disabled="localState.loading" @click="submit">
        <BIMDataIconList size="xs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.saveListButton") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref, watch, nextTick } from "vue";
import { useNamingConstraints } from "../../../../../state/naming-constraints.js";
import { debounce } from "../../../../../utils/async.js";

export default {
  setup() {
    const { createNamingPartsTemplate, updateNamingPartsTemplate } = useNamingConstraints();

    const localState = inject("localState");

    const isUpdate = computed(() => !!localState.template);

    const name = ref("");
    const elements = ref([""]);
    const hasInvalidName = ref(false);
    const hasInvalidElements = ref(false);

    const lastInput = ref(null);

    watch(
      () => localState.template,
      (template) => {
        name.value = template?.name ?? "";
        const values = template?.elements ?? [];
        elements.value = values.length > 0 ? [...values] : [""];
        hasInvalidName.value = false;
        hasInvalidElements.value = false;
      },
      { immediate: true },
    );

    const cleanElements = () => elements.value.map((element) => element.trim()).filter(Boolean);

    const updateElement = (index, value) => {
      elements.value.splice(index, 1, value);
    };

    const focusLastInput = async () => {
      await nextTick();
      lastInput.value?.focus();
    };

    const addElement = async () => {
      elements.value.push("");
      await focusLastInput();
    };

    const removeElement = (index) => {
      elements.value.splice(index, 1);
      if (elements.value.length === 0) {
        elements.value.push("");
      }
    };

    const cancel = () => {
      localState.ruleDraft = null;
      localState.constraint = null;
      localState.pendingTemplatePartIndex = null;
      localState.newlyCreatedTemplate = null;
      localState.previousView = null;
      localState.currentView = "list";
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
            payload,
          );
          localState.templates = localState.templates.map((item) =>
            item.id === template.id ? template : item,
          );
        } else {
          template = await createNamingPartsTemplate(localState.project, payload);
          localState.templates = [...localState.templates, template];
        }
        if (localState.pendingTemplatePartIndex !== null) {
          localState.currentTab = localState.previousView.tab;
          localState.currentView = localState.previousView.view;
        } else {
          localState.currentTab = "constraints";
          localState.currentView = "form";
        }
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
      lastInput,
      // Methods
      updateElement,
      addElement,
      removeElement,
      cancel,
      submit,
    };
  },
};
</script>

<style scoped src="./NamingPartsTemplateForm.css"></style>
