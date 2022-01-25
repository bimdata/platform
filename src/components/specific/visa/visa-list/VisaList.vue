<template>
  <div class="visa-list">
    <div class="visa-list__header">
      <div class="visa-list__header__left-side">
        <BIMDataIcon
          name="visa"
          fill
          color="primary"
          size="s"
          margin="2.5px 0 0 0"
        />
        <span>{{ $t("Visa.list.title") }}</span>
      </div>
      <div class="visa-list__header__right-side">
        <BIMDataButton ghost rounded icon @click="onClickToClose">
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
          @click="onClickToReachVisa(visa.id, visa.document.id)"
        >
          <BIMDataIcon :name="iconStatus(visa)" size="l" fill color="primary" />
          <div class="visa-list__content__visa__desc">
            <BIMDataTextBox
              class="visa-list__content__visa__desc__title"
              :style="
                visa.status !== visaClosed && visa.validationsInError.length
                  ? 'color: var(--color-high);'
                  : ''
              "
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
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { fullName } from "@/utils/users";
import { formatDateDDMMYYY } from "@/utils/date";
import VISA_STATUS from "@/config/visa-status";

export default {
  components: {},
  props: {
    userVisas: {
      type: Object,
      required: true
    },
    baseInfo: {
      type: Object,
      required: true
    },
    startTab: {
      type: String,
      required: true
    }
  },
  emits: [
    "close",
    "set-is-visa-list",
    "set-visa-id",
    "set-base-info",
    "handle-start-tab"
  ],
  setup(props, { emit }) {
    const { t } = useI18n();

    const userVisasKeys = Object.keys(props.userVisas);

    const tabs = ref([
      {
        id: userVisasKeys[0],
        label: t("Visa.list.visaValidator")
      },
      { id: userVisasKeys[1], label: t("Visa.list.visaCreated") }
    ]);
    const currentTab = ref(props.startTab || tabs.value[0].id);
    const selectTab = tab => (currentTab.value = tab.id);

    const onClickToClose = () => {
      emit("set-is-visa-list", false);
      emit("close");
    };
    const onClickToReachVisa = (visaId, fileId) => {
      emit("set-visa-id", visaId);
      emit("set-base-info", "documentPk", fileId);
      emit("handle-start-tab", currentTab.value);
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
      visaClosed: VISA_STATUS.CLOSE,
      // methods
      onClickToClose,
      onClickToReachVisa,
      selectTab,
      formatDateDDMMYYY,
      fullName,
      iconStatus
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaList.scss"></style>
