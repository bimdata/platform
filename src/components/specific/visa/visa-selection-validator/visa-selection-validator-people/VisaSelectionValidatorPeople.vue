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
    >
      <div class="visa-add-validator-people__acces-denied">
        <BIMDataIcon
          name="warning"
          size="s"
          class="fill-warning"
          style="box-shadow: var(--box-shadow); padding: 3px"
        />
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
    userList: {
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

<style scoped lang="scss" src="./VisaSelectionValidatorPeople.scss"></style>
