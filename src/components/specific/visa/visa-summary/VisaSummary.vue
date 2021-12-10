<template>
  {{ console.log("visa", visa) }}
  {{ console.log("file", file) }}
  <template v-if="visa">
    <div class="visa-summary">
      <div class="visa-summary__header">
        <div class="visa-summary__header__left-side">
          <BIMDataIcon name="visa" size="s" />
          <span>{{ $t("Visa.summary.title") }}</span>
        </div>
        <div class="visa-summary__header__right-side">
          <BIMDataButton ghost rounded icon>
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
          <span>Echéance</span>
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
          >{{ $t("Visa.summary.validate") }}</BIMDataButton
        >
        <BIMDataButton color="high" fill radius>{{
          $t("Visa.summary.deny")
        }}</BIMDataButton>
        <BIMDataButton color="primary" fill radius>{{
          $t("Visa.summary.comment")
        }}</BIMDataButton>
      </div>
      <div class="visa-summary__file">
        <FileIcon :name="file.fileExt" size="20" />
        <span>{{ file.fileName }}</span>
      </div>
      <div class="visa-summary__validator"></div>
    </div>
  </template>
</template>

<script>
import { ref, onMounted } from "vue";

import { useVisa } from "@/state/visa";
// import { useProjects } from "@/state/projects";
import { fullName } from "@/utils/random";
import { formatDateDDMMYYY } from "@/utils/date";
import { fileExtension } from "@/utils/files";

export default {
  components: {},
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
  setup(props) {
    const { fetchVisa } = useVisa();
    // const { fetchFileInProject } = useProjects();
    const visa = ref(null);
    const file = ref({
      fileName: "gif_cat.webp",
      fileExt: fileExtension("gif_cat.webp")
    });

    const getVisa = async () => {
      const res = await fetchVisa(props.visaId, props.baseInfo);
      visa.value = {
        ...res,
        deadline: formatDateDDMMYYY(res.deadline),
        creator: {
          ...res.creator,
          fullName: fullName(res.creator)
        }
      };
    };

    // const getFile = async () => {
    //   const res = await fetchFileInProject(
    //     {
    //       id: props.baseInfo.projectPk,
    //       cloud: {
    //         id: props.baseInfo.cloudPk
    //       }
    //     },
    //     { id: props.baseInfo.documentPk }
    //   );
    //   file.value = res;

    //   return {
    //     ...res,
    //     fileExtension: fileExtension(res.name)
    //   };
    // };

    onMounted(() => getVisa());
    return {
      // references
      visa,
      file,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSummary.scss"></style>
