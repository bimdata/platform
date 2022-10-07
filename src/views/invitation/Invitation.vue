<template>
  {{ console.log("invitationList", invitationList) }}
  <div class="invitation">
    <div class="invitation__back-btn">
      <GoBackButton />
    </div>
    <div class="invitation__content">
      <span class="invitation__content__title">{{
        $t("Invitation.title")
      }}</span>
      <template v-if="invitationList">
        <div class="invitation__content__header">
          <span class="invitation__content__header__counter">{{
            $t("Invitation.invitCounter") + ` ${invitationList.length}`
          }}</span>
          <BIMDataButton color="primary" fill radius>
            {{ $t("Invitation.acceptAll") }}
          </BIMDataButton>
        </div>
        <div class="invitation__content__list">
          <div
            class="invitation__content__list__invit"
            v-for="invit in invitationList"
            :key="invit.id"
          >
            <UserAvatar :user="invit.sender" size="40" />
            <div class="invitation__content__list__invit__text">
              <i18n-t
                class="invitation__content__list__invit__text__invited-by"
                :keypath="`Invitation.invitedIn${
                  invit.project_name ? 'Project' : 'Space'
                }`"
                tag="span"
              >
                <template v-slot:sender>
                  <BIMDataTextbox
                    class="invitation__content__list__invit__text__invited-by__highlight"
                    maxWidth="45%"
                    width="auto"
                    :text="fullName(invit.sender)"
                  />
                </template>
                <template v-if="invit.project_name" v-slot:project>
                  <BIMDataTextbox
                    class="invitation__content__list__invit__text__invited-by__highlight"
                    maxWidth="40%"
                    width="auto"
                    :text="invit.project_name"
                  />
                </template>
                <template v-slot:cloud>
                  <BIMDataTextbox
                    class="invitation__content__list__invit__text__invited-by__highlight"
                    maxWidth="40%"
                    width="auto"
                    :text="invit.cloud_name"
                  />
                </template>
              </i18n-t>
              <span
                :class="`invitation__content__list__invit__text__invited-status-${invit.status}`"
              >
                <template
                  v-if="invit.status === INVITATION_VALIDATION_STATUS.ACCEPT"
                >
                  {{ $t("Invitation.invitAccepted") }}
                </template>
                <template
                  v-else-if="invit.status === INVITATION_VALIDATION_STATUS.DENY"
                >
                  {{ $t("Invitation.invitDenied") }}
                </template>
                <template
                  v-else-if="
                    invit.status === INVITATION_VALIDATION_STATUS.PENDING
                  "
                >
                  {{ $t("Invitation.invitPending") }}
                </template>

                <!-- ({{ $d(invit.date, "long") }}) -->
              </span>
            </div>
            <div class="invitation__content__list__invit__button">
              <template
                v-if="invit.status === INVITATION_VALIDATION_STATUS.ACCEPT"
              >
                <BIMDataButton color="primary" fill radius onClick="">
                  <template v-if="invit.project_name">
                    {{ $t("Invitation.goToProject") }}
                  </template>
                  <template v-else>
                    {{ $t("Invitation.goToSpace") }}
                  </template>
                </BIMDataButton>
              </template>
              <template
                v-if="invit.status === INVITATION_VALIDATION_STATUS.PENDING"
              >
                <div class="invitation__content__list__invit__button__pending">
                  <BIMDataButton
                    class="invitation__content__list__invit__button__pending__deny"
                    width="35px"
                    height="35px"
                    radius
                    ghost
                    icon
                    @click="onDenyInvitation(invit)"
                  >
                    <BIMDataIcon name="close" fill color="high" size="s" />
                  </BIMDataButton>
                  <BIMDataButton
                    class="invitation__content__list__invit__button__pending__accept"
                    width="35px"
                    height="35px"
                    radius
                    ghost
                    icon
                    @click="onAcceptInvitation(invit)"
                  >
                    <BIMDataIcon
                      name="validate"
                      fill
                      color="success"
                      size="s"
                    />
                  </BIMDataButton>
                </div>
                <div></div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="invitation__empty-div"></div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fullName } from "../../utils/users.js";
import { INVITATION_VALIDATION_STATUS } from "../../config/invitation.js";
import InvitationViewService from "../../services/InvitationViewService.js";

import GoBackButton from "../../components/specific/app/go-back-button/GoBackButton.vue";
import UserAvatar from "../../components/specific/users/user-avatar/UserAvatar.vue";

export default {
  components: {
    GoBackButton,
    UserAvatar
  },
  setup() {
    const router = useRouter();

    const invitationList = ref(null);
    const fetchInvitation = async () => {
      invitationList.value = await InvitationViewService.fetchInvitations();
    };

    const onAcceptInvitation = async invitation => {
      await InvitationViewService.acceptInvitation(invitation);
      await fetchInvitation();
    };

    const onDenyInvitation = async invitation => {
      await InvitationViewService.denyInvitation(invitation);
      await fetchInvitation();
    };

    onMounted(async () => fetchInvitation());

    return {
      // references
      invitationList,
      INVITATION_VALIDATION_STATUS,
      // methods
      fullName,
      onAcceptInvitation,
      onDenyInvitation,
      getBack: () => router.back(),
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./Invitation.scss"></style>
