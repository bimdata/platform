<template>
  <div
    class="visa-add-validator-people"
    v-for="people in userList"
    :key="people.id"
  >
    <BIMDataCheckbox
      :disabled="!people.hasAccess"
      :modelValue="people.isSelected"
      @update:modelValue="toggle(people, $event)"
    >
    </BIMDataCheckbox>
    <div class="visa-add-validator-people__picture">
      <UserAvatar :user="people" size="40" color="silver-light" />
    </div>
    <div v-if="people.fullName" class="visa-add-validator-people__info">
      <BIMDataTextBox
        class="visa-add-validator-people__info__main"
        :class="{ hide: !people.hasAccess }"
        :text="people.fullName"
      />
      <span
        class="visa-add-validator-people__info__second"
        :class="{ hide: !people.hasAccess }"
        >{{ people.email }}</span
      >
    </div>
    <div v-else class="visa-add-validator-people__info__main">
      <span :class="{ hide: !people.hasAccess }">{{ people.email }}</span>
    </div>
    <div
      v-if="!people.hasAccess"
      class="visa-add-validator-people__acces-denied"
      @mouseover="handleCurrentPerson(people.id)"
      @mouseleave="handleCurrentPerson()"
    >
      <BIMDataIcon
        name="warning"
        size="xl"
        class="fill-warning"
        style="padding: 10px; z-index: 3"
      />
      <div
        v-if="isWarningHover && currentPeopleId === people.id"
        class="visa-add-validator-people__acces-denied__hover"
      >
        <span>{{ $t("Visa.selectionValidator.warning") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";

export default {
  components: {
    UserAvatar
  },
  props: {
    userList: {
      type: Array,
      required: true
    }
  },
  emits: [],
  setup() {
    const currentPeopleId = ref(null);
    const isWarningHover = ref(false);
    const toggle = (people, checked) => (people.isSelected = checked);

    const handleCurrentPerson = peopleId => {
      if (peopleId) {
        isWarningHover.value = true;
        currentPeopleId.value = peopleId;
      } else {
        isWarningHover.value = false;
        currentPeopleId.value = null;
      }
    };

    return {
      // references
      isWarningHover,
      currentPeopleId,
      // methods
      toggle,
      handleCurrentPerson
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSelectionValidatorPeople.scss"></style>
