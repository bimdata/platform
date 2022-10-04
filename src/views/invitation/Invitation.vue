<template>
  <div class="invitation">
    <div class="invitation__back-btn">
      <GoBackButton />
    </div>
    <div class="invitation__content">
      <span>{{ $t("Invitation.title") }}</span>
      <div class="invitation__content__header">
        <span class="invitation__content__header__counter">{{
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
          <UserAvatar :user="invit.sender" size="40" />
          <div class="invitation__content__list__invit__text">
            <i18n-t
              class="invitation__content__list__invit__text__invited-by"
              keypath="Invitation.invitedBy"
              tag="span"
            >
              <template v-slot:sender>
                <BIMDataTextbox
                  class="invitation__content__list__invit__text__invited-by__highlight"
                  maxWidth="40%"
                  width="auto"
                  :text="fullName(invit.sender)"
                />
              </template>
              <template v-slot:project>
                <BIMDataTextbox
                  class="invitation__content__list__invit__text__invited-by__highlight"
                  maxWidth="40%"
                  width="auto"
                  :text="invit.project"
                />
              </template>
              <template v-slot:cloud>
                <BIMDataTextbox
                  class="invitation__content__list__invit__text__invited-by__highlight"
                  maxWidth="40%"
                  width="auto"
                  :text="invit.cloud"
                />
              </template>
            </i18n-t>
            <span
              :class="`invitation__content__list__invit__text__invited-status-${invit.status}`"
            >
              <template v-if="invit.status === 'A'">
                {{ $t("Invitation.invitAccepted") }}
              </template>
              <template v-else-if="invit.status === 'D'">
                {{ $t("Invitation.invitDenied") }}
              </template>
              <template v-else-if="invit.status === 'W'">
                {{ $t("Invitation.invitPending") }}
              </template>

              ({{ $d(invit.date, "long") }})
            </span>
          </div>
          <div class="invitation__content__list__invit__button">
            <template v-if="invit.status === 'A'">
              <BIMDataButton color="primary" fill radius>
                {{ $t("Invitation.goToProject") }}
              </BIMDataButton>
            </template>
            <template v-if="invit.status === 'W'">
              <div class="invitation__content__list__invit__button__pending">
                <BIMDataButton
                  class="invitation__content__list__invit__button__pending__deny"
                  width="40px"
                  height="40px"
                  ghost
                  icon
                >
                  <BIMDataIcon name="close" fill color="high" size="m" />
                </BIMDataButton>
                <BIMDataButton
                  class="invitation__content__list__invit__button__pending__accept"
                  width="40px"
                  height="40px"
                  ghost
                  icon
                >
                  <BIMDataIcon name="validate" fill color="success" size="m" />
                </BIMDataButton>
              </div>

              <div></div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="invitation__empty-div"></div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { fullName } from "../../utils/users.js";

import GoBackButton from "../../components/specific/app/go-back-button/GoBackButton.vue";
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
          firstname: "Jean-Claude",
          lastname: "Convenant"
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
      },
      {
        project: "project3",
        cloud: "new viewer",
        date: new Date(),
        status: "A",
        sender: {
          firstname: "Jojo",
          lastname: "Bravo"
        }
      },
      {
        project: "project3 rhone alpes 69 france 2022",
        cloud: "new viewer lyon crayon part dieur ",
        date: new Date(),
        status: "A",
        sender: {
          firstname: "paul dimitri brendan pedro silvere",
          lastname: "Bravo moro vilalta camilli remeur letellier"
        }
      },
      {
        project: "project3",
        cloud: "new viewer",
        date: new Date(),
        status: "A",
        sender: {
          firstname: "Jojo",
          lastname: "Bravo"
        }
      },
      {
        project: "project3",
        cloud: "new viewer",
        date: new Date(),
        status: "A",
        sender: {
          firstname: "Jojo",
          lastname: "Bravo"
        }
      },
      {
        project: "project3",
        cloud: "new viewer",
        date: new Date(),
        status: "A",
        sender: {
          firstname: "Jojo",
          lastname: "Bravo"
        }
      },
      {
        project: "project3",
        cloud: "new viewer",
        date: new Date(),
        status: "A",
        sender: {
          firstname: "Jojo",
          lastname: "Bravo"
        }
      }
    ];
    return {
      // references
      invitList,
      // methods
      fullName,
      getBack: () => router.back()
    };
  }
};
</script>

<style scoped lang="scss" src="./Invitation.scss"></style>
