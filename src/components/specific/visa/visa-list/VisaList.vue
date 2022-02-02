<template>
  <div class="visa-list">
    <div class="visa-list__header">
      <div class="visa-list__header__left-side">
        <template v-if="visasLoading">
          <div class="visa-list__header__left-side__loader">
            <BIMDataSpinner />
          </div>
        </template>
        <template v-else>
          <BIMDataIcon
            name="visa"
            fill
            color="primary"
            size="s"
            margin="2.5px 0 0 0"
          />
        </template>
        <span>{{ $t("Visa.list.title") }}</span>
      </div>
      <div class="visa-list__header__right-side">
        <BIMDataButton ghost rounded icon @click="$emit('close')">
          <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
        </BIMDataButton>
      </div>
    </div>
    <BIMDataTabs
      width="100%"
      height="40px"
      tabSize="50%"
      :tabs="tabs"
      :selected="currentTab.id"
      @tab-click="selectTab"
    />
    <div class="visa-list__content">
      <template v-if="currentTab.visas.length === 0">
        <div class="visa-list__content__empty">
          <BIMDataIcon
            name="visa"
            size="xxl"
            color="silver"
            margin="3px 0 0 0"
          />
          <span v-if="currentTab.id === 'toValidateVisas'">
            {{ $t("Visa.list.emptyValidation") }}
          </span>
          <span v-else>
            {{ $t("Visa.list.emptyDemand") }}
          </span>
        </div>
      </template>
      <template v-else>
        <div
          class="visa-list__content__visa"
          v-for="visa of currentTab.visas"
          :key="visa.id"
          @click="!visasLoading && $emit('reach-visa', visa)"
        >
          <BIMDataIcon :name="iconStatus(visa)" size="l" fill color="primary" />
          <div class="visa-list__content__visa__desc">
            <BIMDataTextBox
              class="visa-list__content__visa__desc__title"
              :style="isVisaUnderError(visa) ? 'color: var(--color-high);' : ''"
              :text="visa.document.name"
            />
            <div class="visa-list__content__visa__desc__info">
              <span>{{ $d(visa.deadline, "short") }} </span>
              -
              <BIMDataTextBox
                :text="
                  visa.creator ? fullName(visa.creator) : 'utilisateur supprimé'
                "
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { fullName } from "@/utils/users";
import { VISA_STATUS } from "@/config/visa";

// This variable is shared between all componant instances.
let lastUsedTabIndex = 0;

export default {
  props: {
    toValidateVisas: {
      type: Array,
      required: true
    },
    createdVisas: {
      type: Array,
      required: true
    },
    visasLoading: {
      type: Boolean,
      required: true
    }
  },
  emits: ["reach-visa", "close"],
  setup(props) {
    const { t } = useI18n();

    const tabs = computed(() => {
      return [
        {
          id: "toValidateVisas",
          label: t("Visa.list.toValidateVisas"),
          visas: props.toValidateVisas
        },
        {
          id: "createdVisas",
          label: t("Visa.list.createdVisas"),
          visas: props.createdVisas
        }
      ];
    });

    const currentTabIndex = ref(lastUsedTabIndex);
    const currentTab = computed(() => tabs.value[currentTabIndex.value]);

    const selectTab = tab => {
      lastUsedTabIndex = tabs.value.indexOf(tab);
      currentTabIndex.value = lastUsedTabIndex;
    };

    const isVisaUnderError = visa =>
      visa.status !== VISA_STATUS.CLOSE && visa.validationsInError.length;

    const iconStatus = visa => {
      const { status, validationsInError } = visa;
      if (status === VISA_STATUS.CLOSE) {
        return "validatedFile";
      } else if (validationsInError.length) {
        return "deniedFile";
      } else {
        return "inProgressFile";
      }
    };

    return {
      // references
      tabs,
      currentTab,
      // methods
      selectTab,
      fullName,
      iconStatus,
      isVisaUnderError
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaList.scss"></style>
