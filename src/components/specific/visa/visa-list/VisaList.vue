<template>
  <div class="visa-list">
    <div class="visa-list__header">
      <div class="visa-list__header__left-side">
        <BIMDataIcon name="visa" size="s" />
        <span>{{ $t("Visa.list.title") }}</span>
      </div>
      <div class="visa-list__header__right-side">
        <BIMDataButton ghost rounded icon @click="onClickToClose">
          <BIMDataIcon name="close" size="xxxs" />
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
      <div
        class="visa-list__content__visa"
        v-for="visa of userVisas[currentTab]"
        :key="visa.id"
        @click="onClickToReachVisa(visa.id, visa.document.id)"
      >
        <FileIcon :name="fileExtension(visa.document.name)" size="20" />
        <div class="visa-list__content__visa__desc">
          <span class="visa-list__content__visa__desc__title">{{
            visa.document.name
          }}</span>
          <div>
            <span>{{ formatDateDDMMYYY(visa.deadline) }}</span>
            -
            <span>{{ fullName(visa.creator) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { fileExtension } from "@/utils/files";
import { fullName } from "@/utils/users";
import { formatDateDDMMYYY } from "@/utils/date";

export default {
  components: {},
  props: {
    userVisas: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "set-is-visa-list", "set-visa-id", "set-base-info"],
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
    const currentTab = ref(tabs.value[0].id);
    const selectTab = tab => (currentTab.value = tab.id);

    const onClickToClose = () => {
      emit("set-is-visa-list", false);
      emit("close");
    };
    const onClickToReachVisa = (visaId, fileId) => {
      emit("set-visa-id", visaId);
      emit("set-base-info", "documentPk", fileId);
    };

    return {
      // references
      tabs,
      currentTab,
      // methods
      onClickToClose,
      onClickToReachVisa,
      selectTab,
      fileExtension,
      formatDateDDMMYYY,
      fullName,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaList.scss"></style>
