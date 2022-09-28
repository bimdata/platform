<template>
  <div class="invitation">
    <div class="invitation__back-btn">
      <GoBackButton />
    </div>
    <div class="invitation__content">
      <span>{{ $t("Invitation.title") }}</span>
      <div class="invitation__content__header">
        <span>{{
          $t("Invitation.invitCounter") + ` ${invitList.length}`
        }}</span>
        <BIMDataButton color="primary" fill radius>
          {{ $t("Invitation.acceptAll") }}
        </BIMDataButton>
      </div>
      <div class="invitation__content__list">
        <div
          class="invitation__content__list__invit"
          v-for="invit in invitList"
          :key="invit.project"
        >
          <UserAvatar :user="invit.sender" size="50" />
          <div class="invitation__content__list__invit__text">
            <span>
              {{
                $t("Invitation.invitedBy", {
                  sender: `${invit.sender.firstname} ${invit.sender.lastname}`,
                  project: invit.project,
                  cloud: invit.cloud
                })
              }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="invitation__empty-div"></div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import UserAvatar from "../../components/specific/users/user-avatar/UserAvatar.vue";

export default {
  components: {
    GoBackButton,
    UserAvatar
  },
  setup() {
    const router = useRouter();
    const invitList = [
      {
        project: "test-dwg",
        cloud: "new viewer",
        date: new Date(),
        status: "A",
        sender: {
          firstname: "Hugo",
          lastname: "Duroux"
        }
      },
      {
        project: "new project",
        cloud: "new viewer",
        date: new Date(),
        status: "D",
        sender: {
          firstname: "Jaetan",
          lastname: "Lagier"
        }
      },
      {
        project: "project2",
        cloud: "new viewer",
        date: new Date(),
        status: "W",
        sender: {
          firstname: "Jaja",
          lastname: "Bravas"
        }
      }
    ];
    return {
      invitList,
      getBack: () => router.back()
    };
  }
};
</script>

<style scoped lang="scss" src="./Invitation.scss"></style>
