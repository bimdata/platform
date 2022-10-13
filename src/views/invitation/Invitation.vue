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
            {{
              $t("Invitation.invitCounter") + ` ${invitationListPending.length}`
            }}
          </span>
        </div>
        <BIMDataButton
          :disabled="invitationListPending.length < 1"
          color="primary"
          width="130px"
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
                :class="`invitation__content__list__invit__text__invitation-status--${invit.status}`"
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

                ({{ $d(invit.created_at, "longMonth") }})
              </span>
            </div>
            <div class="invitation__content__list__invit__button">
              <template
                v-if="invit.status === INVITATION_VALIDATION_STATUS.ACCEPT"
              >
                <AppLink
                  :to="
                    invit.project_id
                      ? {
                          name: routeNames.projectBoard,
                          params: {
                            spaceID: invit.cloud_id,
                            projectID: invit.project_id
                          }
                        }
                      : {
                          name: routeNames.spaceBoard,
                          params: {
                            spaceID: invit.cloud_id
                          }
                        }
                  "
                >
                  <BIMDataButton
                    color="primary"
                    :width="isMD ? 'inherit' : '130px'"
                    fill
                    radius
                  >
                    <template v-if="invit.project_name">
                      {{
                        $t(`Invitation.goToProject${isMD ? "Short" : "Long"}`)
                      }}
                    </template>
                    <template v-else>
                      {{ $t(`Invitation.goToSpace${isMD ? "Short" : "Long"}`) }}
                    </template>
                  </BIMDataButton>
                </AppLink>
              </template>
              <template
                v-if="invit.status === INVITATION_VALIDATION_STATUS.PENDING"
              >
                <div class="invitation__content__list__invit__button__pending">
                  <BIMDataButton
                    class="invitation__content__list__invit__button__pending--deny"
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
                    class="invitation__content__list__invit__button__pending--accept"
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
import routeNames from "../../router/route-names.js";
import { useStandardBreakpoints } from "../../composables/responsive.js";
import { INVITATION_VALIDATION_STATUS } from "../../config/invitation.js";
import InvitationViewService from "../../services/InvitationViewService.js";

import AppLink from "../../components/specific/app/app-link/AppLink.vue";
import UserAvatar from "../../components/specific/users/user-avatar/UserAvatar.vue";
import GoBackButton from "../../components/specific/app/go-back-button/GoBackButton.vue";

export default {
  components: {
    GoBackButton,
    UserAvatar,
    AppLink
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
      routeNames,
      invitationList,
      invitationListPending,
      INVITATION_VALIDATION_STATUS,
      // methods
      fullName,
      onDenyInvitation,
      fetchInvitations,
      onAcceptInvitation,
      acceptAllInvitation,
      getBack: () => router.back(),
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./Invitation.scss"></style>
