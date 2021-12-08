<template>
  <div class="visa-add-validator">
    {{ console.log(peopleList, peopleList) }}
    <div class="visa-add-validator__header">
      <div class="visa-add-validator__header__left-side">
        <BIMDataButton ghost rounded icon>
          <BIMDataIcon name="arrow" size="xxs" />
        </BIMDataButton>
        <span>{{ $t("Visa.add.validatorView.getBack") }}</span>
      </div>
      <div class="visa-add-validator__header__middle">
        {{ $t("Visa.add.validatorView.validator") }}
      </div>
      <div class="visa-add-validator__header__right-side">
        <BIMDataButton ghost rounded icon @click="$emit('safe-zone-handler')">
          <BIMDataIcon name="close" size="xxxs" />
        </BIMDataButton>
      </div>
    </div>
    <div class="visa-add-validator__search-bar">
      <BIMDataSearch
        v-model="filter"
        placeholder="Search"
        color="primary"
        radius
        width="100%"
      >
      </BIMDataSearch>
    </div>
    <div class="visa-add-validator__people-list">
      <VisaAddValidatorPeople :peopleList="peopleList" />
    </div>
    <div class="visa-add-validator__action">
      <BIMDataButton color="primary" fill radius width="100%">
        Accepter
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useProjects } from "@/state/projects";
import { fullName } from "@/utils/random";

import VisaAddValidatorPeople from "@/components/specific/visa/visa-add/visa-add-validator/visa-add-validator-people/VisaAddValidatorPeople";

export default {
  components: {
    VisaAddValidatorPeople
  },
  props: {
    baseInfo: {
      type: Object,
      required: true
    },
    fileParentId: {
      type: Number,
      required: true
    }
  },
  emits: ["close"],
  setup(props) {
    const { fetchFolderProjectUsers } = useProjects();
    const filter = ref("");
    const peopleList = ref([]);

    watch(filter, () => {
      peopleList.value = peopleList.value.map(people => ({
        ...people,
        isFindable:
          filter.value === ""
            ? true
            : people.searchContent.includes(filter.value.toLowerCase())
      }));
    });

    const getList = async () => {
      const res = await fetchFolderProjectUsers(
        {
          id: props.baseInfo.projectPk,
          cloud: {
            id: props.baseInfo.cloudPk
          }
        },
        { id: props.fileParentId }
      );

      peopleList.value = res.map(people => ({
        ...people,
        fullName: fullName(people),
        hasAccess: people.permission >= 50,
        isFindable: true,
        searchContent: `${people.firstname || ""}${people.lastname || ""}${
          people.email || ""
        }`.toLowerCase()
      }));
    };

    onMounted(() => getList());

    return {
      //references
      peopleList,
      filter,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaAddValidator.scss"></style>
