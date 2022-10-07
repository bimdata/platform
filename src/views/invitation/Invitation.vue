<template>
  <div class="invitation">
    <div class="invitation__back-btn">
      <GoBackButton />
    </div>
    <div class="invitation__content">
      <span class="invitation__content__title">{{
        $t("Invitation.title")
      }}</span>

      <div class="invitation__content__header">
        <div class="invitation__content__header__counter">
          <span>
            {{ $t("Invitation.invitCounter") + ` ${invitationList.length}` }}
          </span>
        </div>
        <BIMDataButton
          :disabled="invitationListPending.length < 1"
          color="primary"
          fill
          radius
          @click="acceptAllInvitation"
        >
          {{ $t("Invitation.acceptAll") }}
        </BIMDataButton>
      </div>
      <template v-if="invitationList.length > 0">
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
                    @click="onDenyInvitation(invit).then(fetchInvitations)"
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
                    @click="onAcceptInvitation(invit).then(fetchInvitations)"
                  >
                    <BIMDataIcon
                      name="validate"
                      fill
                      color="success"
                      size="s"
                    />
                  </BIMDataButton>
                </div>
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
import async from "async";
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

    const invitationList = ref([]);
    const invitationListPending = ref([]);
    const fetchInvitations = async () => {
      invitationList.value = await InvitationViewService.fetchInvitations();
      invitationListPending.value = invitationList.value.filter(
        invit => invit.status === INVITATION_VALIDATION_STATUS.PENDING
      );
    };

    const onAcceptInvitation = async invitation => {
      await InvitationViewService.acceptInvitation(invitation);
    };

    const onDenyInvitation = async invitation => {
      await InvitationViewService.denyInvitation(invitation);
    };

    const acceptAllInvitation = async () => {
      await async.eachLimit(
        invitationListPending.value,
        20,
        onAcceptInvitation
      );
      await fetchInvitations();
    };

    onMounted(async () => fetchInvitations());

    return {
      // references
      invitationList,
      invitationListPending,
      INVITATION_VALIDATION_STATUS,
      // methods
      fullName,
      fetchInvitations,
      acceptAllInvitation,
      onAcceptInvitation,
      onDenyInvitation,
      getBack: () => router.back(),
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./Invitation.scss"></style>
