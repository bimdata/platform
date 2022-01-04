<template>
  <div
    class="visa-add-validator-people"
    v-for="people in peopleList"
    :key="people.id"
  >
    <BIMDataCheckbox
      :disabled="!people.hasAccess"
      :modelValue="people.isSelected"
      @update:modelValue="toggle(people, $event)"
    >
    </BIMDataCheckbox>
    <div
      class="visa-add-validator-people__picture"
      :class="{ hide: !people.hasAccess }"
    >
      <UserAvatar :user="people" size="40" />
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
        <BIMDataIcon name="warning" size="s" class="fill-warning" />
      </div>
    </div>
  </div>
</template>

<script>
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
  setup() {
    const toggle = (people, checked) => (people.isSelected = checked);

    return {
      // methods
      toggle
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaAddValidatorPeople.scss"></style>
