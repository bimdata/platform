<template>
  <template v-for="user in userList" :key="user.id">
    <div v-if="user.isFindable" class="visa-add-validator-users">
      <BIMDataCheckbox
        :disabled="!user.hasAccess"
        :modelValue="user.isSelected"
        @update:modelValue="toggle(user, $event)"
      >
      </BIMDataCheckbox>
      <div class="visa-add-validator-users__picture">
        <UserAvatar :user="user" size="40" color="silver-light" />
      </div>
      <div v-if="user.fullName" class="visa-add-validator-users__info">
        <BIMDataTextbox
          class="visa-add-validator-users__info__main"
          :class="{ hide: !user.hasAccess }"
          :text="user.fullName"
        />
        <span
          class="visa-add-validator-users__info__second"
          :class="{ hide: !user.hasAccess }"
          >{{ user.email }}</span
        >
      </div>
      <div v-else class="visa-add-validator-users__info">
        <span
          class="visa-add-validator-users__info__main"
          :class="{ hide: !user.hasAccess }"
          >{{ user.email }}</span
        >
      </div>
      <div
        v-if="!user.hasAccess"
        class="visa-add-validator-users__acces-denied"
        @mouseover="handleCurrentPerson(user.id)"
        @mouseleave="handleCurrentPerson()"
      >
        <BIMDataIcon
          name="warning"
          size="xl"
          class="fill-warning"
          style="padding: 10px; z-index: 3"
        />
        <div
          v-if="isWarningHover && currentPeopleId === user.id"
          class="visa-add-validator-users__acces-denied__hover"
        >
          <span>{{ $t("Visa.selectionValidator.warning") }}</span>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import { ref } from "vue";
// Components
import UserAvatar from "../../../users/user-avatar/UserAvatar.vue";

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
  emits: ["update-people"],
  setup(props, { emit }) {
    const currentPeopleId = ref(null);
    const isWarningHover = ref(false);
    const toggle = (people, checked) => {
      people.isSelected = checked;
      emit("update-people", updateList(people, checked));
    };

    const updateList = (people, checked) =>
      props.userList.map(user => {
        if (user.id === people.id) {
          return {
            ...user,
            isSelected: checked
          };
        } else {
          return {
            ...user
          };
        }
      });

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

<style scoped lang="scss" src="./VisaSelectionValidatorUsers.scss"></style>
