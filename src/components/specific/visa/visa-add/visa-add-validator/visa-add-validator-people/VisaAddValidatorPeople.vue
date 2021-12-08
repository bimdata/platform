<template>
  {{ console.log("list", list) }}
  <div
    class="visa-add-validator-people"
    v-for="people in list"
    :key="people.id"
  >
    <BIMDataCheckbox :disabled="!people.hasAccess"> </BIMDataCheckbox>
    <div
      class="visa-add-validator-people__picture"
      :class="{ hide: !people.hasAccess }"
    >
      <UserAvatar
        class="app-header-menu__btn__avatar"
        :user="people"
        size="40"
      />
    </div>
    <div v-if="people.fullName" class="visa-add-validator-people__info">
      <span class="visa-add-validator-people__info__main">{{
        people.fullName
      }}</span>
      <span>{{ people.email }}</span>
    </div>
    <div v-else class="visa-add-validator-people__info">
      <span class="visa-add-validator-people__info__main">{{
        people.email
      }}</span>
    </div>
    <div
      v-if="!people.hasAccess"
      class="visa-add-validator-people__acces-denied"
    >
      <div class="visa-add-validator-people__acces-denied">
        <BIMDataIcon name="warning" size="s" class="fill-high" />
        <span>{{ $t("Visa.add.validatorView.accesDenied") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";

export default {
  components: {
    UserAvatar
  },
  props: {
    peopleList: {
      type: Array,
      required: true
    }
  },
  emits: [],
  setup(props) {
    const list = ref([]);

    watch(
      () => props.peopleList,
      () => {
        list.value = props.peopleList.filter(({ isFindable }) => isFindable);
      }
    );

    return {
      console,
      list
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaAddValidatorPeople.scss"></style>
