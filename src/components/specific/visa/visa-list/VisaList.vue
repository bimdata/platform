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
      :selected="currentTab"
      @tab-click="selectTab"
    />
    <div class="visa-list__content">
      <template v-if="userVisas[currentTab].length === 0">
        <div class="visa-list__content__empty">
          <BIMDataIcon
            name="visa"
            size="xxl"
            color="silver"
            margin="3px 0 0 0"
          />
          <span v-if="currentTab === 'toValidateVisas'">
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
          v-for="visa of userVisas[currentTab]"
          :key="visa.id"
          @click="!visasLoading && onClickToReachVisa(visa)"
        >
          <BIMDataIcon :name="iconStatus(visa)" size="l" fill color="primary" />
          <div class="visa-list__content__visa__desc">
            <BIMDataTextBox
              class="visa-list__content__visa__desc__title"
              :style="isVisaUnderError(visa) ? 'color: var(--color-high);' : ''"
              :text="visa.document.name"
            />
            <div class="visa-list__content__visa__desc__info">
              <span>{{ formatDateDDMMYYY(visa.deadline) }}</span>
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
import { formatDateDDMMYYY } from "@/utils/date";
import { visaStatus as VISA_STATUS } from "@/config/visa";

export default {
  components: {},
  props: {
    userVisas: {
      type: Object,
      required: true
    },
    startTab: {
      type: String,
      required: true
    },
    visasLoading: {
      type: Boolean,
      required: true
    }
  },
  emits: ["reach-visa", "close"],
  setup(props, { emit }) {
    const { t } = useI18n();

    const tabs = computed(() => {
      const userVisasKeys = Object.keys(props.userVisas);
      return [
        {
          id: userVisasKeys[0],
          label: t("Visa.list.visaValidator")
        },
        { id: userVisasKeys[1], label: t("Visa.list.visaCreated") }
      ];
    });

    const isVisaUnderError = visa =>
      visa.status !== VISA_STATUS.CLOSE && visa.validationsInError.length;

    const currentTab = ref(props.startTab || tabs.value[0].id);
    const selectTab = tab => (currentTab.value = tab.id);

    const onClickToReachVisa = visa => {
      emit("reach-visa", visa, currentTab.value);
    };

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
      onClickToReachVisa,
      selectTab,
      formatDateDDMMYYY,
      fullName,
      iconStatus,
      isVisaUnderError
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaList.scss"></style>
