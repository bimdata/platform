<template>
  <template v-if="visa">
    <div class="visa-summary">
      <div class="visa-summary__header">
        <div class="visa-summary__header__left-side">
          <BIMDataIcon name="visa" size="s" />
          <span>{{ $t("Visa.summary.title") }}</span>
        </div>
        <div class="visa-summary__header__right-side">
          <BIMDataButton ghost rounded icon @click="onClose">
            <BIMDataIcon name="close" size="xxxs" />
          </BIMDataButton>
        </div>
      </div>
      <div class="visa-summary__content">
        <div class="visa-summary__content__applicant">
          {{ $t("Visa.summary.appliedBy") }}
          <span>{{ visa.creator.fullName }}</span>
        </div>
        <div class="visa-summary__content__desc">
          {{ visa.description }}
        </div>
        <div class="visa-summary__content__deadline">
          <span class="visa-summary__content__deadline__title">{{
            $t("Visa.summary.term")
          }}</span>
          <span class="visa-summary__content__deadline__date">{{
            visa.deadline
          }}</span>
        </div>
      </div>
      <div class="visa-summary__action-button">
        <BIMDataButton
          style="background-color: var(--color-success)"
          fill
          radius
          @click="validateVisa"
          >{{ $t("Visa.summary.validate") }}</BIMDataButton
        >
        <BIMDataButton color="high" fill radius @click="refuseVisa">{{
          $t("Visa.summary.deny")
        }}</BIMDataButton>
        <BIMDataButton color="primary" fill radius>{{
          $t("Visa.summary.comment")
        }}</BIMDataButton>
      </div>
      <div class="visa-summary__file">
        <FileIcon :name="visa.document.fileExt" size="20" />
        <span>{{ visa.document.fileName }}</span>
      </div>
      <div class="visa-summary__validator">
        <span class="visa-summary__validator__title">{{
          $t("Visa.summary.validator")
        }}</span>
        <div class="visa-summary__validator__people-list">
          <VisaSummaryPeople :peopleList="visa.validations" />
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import { ref, onMounted } from "vue";
import VisaSummaryPeople from "./visa-summary-people/VisaSummaryPeople";

import { useVisa } from "@/state/visa";
import { fullName } from "@/utils/users";
import { formatDateDDMMYYY } from "@/utils/date";
import { fileExtension } from "@/utils/files";

export default {
  components: { VisaSummaryPeople },
  props: {
    baseInfo: {
      type: Object,
      required: true
    },
    visaId: {
      type: Number,
      required: true
    }
  },
  emits: ["close", "set-visa-id"],
  setup(props, { emit }) {
    const { fetchVisa, acceptVisa, denyVisa } = useVisa();
    const visa = ref(null);

    const getVisa = async () => {
      const res = await fetchVisa(props.visaId, props.baseInfo);
      visa.value = {
        ...res,
        deadline: formatDateDDMMYYY(res.deadline),
        creator: {
          ...res.creator,
          fullName: fullName(res.creator)
        },
        document: {
          ...res.document,
          fileExt: fileExtension(res.document.fileName)
        },
        validations: res.validations
          .map(elem => ({
            ...elem,
            fullName: fullName(elem.validator)
          }))
          .sort((a, b) => {
            if (!a.fullName) return 1;
            if (!b.fullName) return -1;
            return a.fullName < b.fullName ? -1 : 1;
          })
      };
    };

    const validateVisa = async () => {
      await acceptVisa(48, props.visaId, props.baseInfo);
      getVisa();
    };
    const refuseVisa = async () => {
      await denyVisa(48, props.visaId, props.baseInfo);
      getVisa();
    };

    const onClose = () => {
      emit("set-visa-id", null);
      emit("close");
    };

    onMounted(() => getVisa());
    return {
      // references
      visa,
      // methods
      validateVisa,
      refuseVisa,
      onClose
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSummary.scss"></style>
