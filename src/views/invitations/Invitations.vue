<template>
  <div class="invitations">
    <div class="invitations__back-btn">
      <GoBackButton />
    </div>
    <div class="invitations__content">
      <span class="invitations__content__title">
        {{ $t("Invitations.title") }}
      </span>

      <div class="invitations__content__header">
        <div class="invitations__content__header__counter">
          <span>
            {{
              $t("Invitations.invitCounter") +
              ` ${pendingInvitations.length}`
            }}
          </span>
        </div>
        <BIMDataButton
          data-test-id="btn-accept-all-invit"
          :disabled="pendingInvitations.length < 1 || isLoadingAllInvit"
          color="primary"
          width="130px"
          fill
          radius
          @click="onAcceptInvitations"
        >
          {{ $t("Invitations.acceptAll") }}
        </BIMDataButton>
      </div>
      <template v-if="invitations.length > 0">
        <div class="invitations__content__list">
          <div
            class="invitations__content__list__invit"
            data-test-id="card-invitation"
            v-for="invit in invitations"
            :key="invit.id"
          >
            <template v-if="invit.sender">
              <UserAvatar :user="invit.sender" size="40" />
            </template>
            <template v-else>
              <div class="invitations__content__list__invit__icon-bcg">
                <BIMDataIconApp color="white" />
              </div>
            </template>
            <div class="invitations__content__list__invit__text">
              <i18n-t
                class="invitations__content__list__invit__text__invited-by"
                :keypath="`Invitations.invitedIn${
                  invit.project_name ? 'Project' : 'Space'
                }`"
                tag="span"
              >
                <template #sender>
                  <BIMDataTextbox
                    v-if="invit.sender"
                    class="invitations__content__list__invit__text__invited-by__highlight"
                    maxWidth="45%"
                    width="auto"
                    :text="fullName(invit.sender)"
                  />
                  <BIMDataTextbox
                    v-else
                    class="invitations__content__list__invit__text__invited-by__highlight"
                    maxWidth="45%"
                    width="auto"
                    :text="invit.client_name"
                  />
                </template>
                <template v-if="invit.project_name" #project>
                  <BIMDataTextbox
                    class="invitations__content__list__invit__text__invited-by__highlight"
                    maxWidth="40%"
                    width="auto"
                    :text="invit.project_name"
                  />
                </template>
                <template #cloud>
                  <BIMDataTextbox
                    class="invitations__content__list__invit__text__invited-by__highlight"
                    maxWidth="40%"
                    width="auto"
                    :text="invit.cloud_name"
                  />
                </template>
              </i18n-t>
              <span
                :class="`invitations__content__list__invit__text__invitation-status--${invit.status}`"
              >
                <template v-if="invit.status === INVITATION_STATUS.ACCEPTED">
                  {{ $t("Invitations.invitAccepted") }}
                </template>
                <template v-else-if="invit.status === INVITATION_STATUS.DENIED">
                  {{ $t("Invitations.invitDenied") }}
                </template>
                <template
                  v-else-if="invit.status === INVITATION_STATUS.PENDING"
                >
                  {{ $t("Invitations.invitPending") }}
                </template>

                ({{ $d(invit.created_at, "longMonth") }})
              </span>
            </div>
            <div class="invitations__content__list__invit__button">
              <template v-if="invit.status === INVITATION_STATUS.ACCEPTED">
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
                    data-test-id="btn-go-to-project"
                    color="primary"
                    :width="isMD ? 'inherit' : '130px'"
                    fill
                    radius
                  >
                    <template v-if="invit.project_name">
                      {{
                        isMD ? $t("t.project") : $t("Invitations.goToProject")
                      }}
                    </template>
                    <template v-else>
                      {{ isMD ? $t("t.space") : $t("Invitations.goToSpace") }}
                    </template>
                  </BIMDataButton>
                </AppLink>
              </template>
              <template v-if="invit.status === INVITATION_STATUS.PENDING">
                <div class="invitations__content__list__invit__button__pending">
                  <BIMDataButton
                    data-test-id="btn-deny-invit"
                    class="invitations__content__list__invit__button__pending--deny"
                    :disabled="isLoadingSingleInvit || isLoadingAllInvit"
                    width="35px"
                    height="35px"
                    radius
                    ghost
                    icon
                    @click="onDenyInvitation(invit)"
                  >
                    <BIMDataIconClose fill color="high" size="s" />
                  </BIMDataButton>
                  <BIMDataButton
                    data-test-id="btn-accept-invit"
                    :disabled="
                      isLoadingAllInvit ||
                      (currentInvitation && currentInvitation.id !== invit.id)
                    "
                    class="invitations__content__list__invit__button__pending--accept"
                    width="35px"
                    height="35px"
                    radius
                    ghost
                    icon
                    @click="onAcceptInvitations(invit)"
                  >
                    <template
                      v-if="
                        isLoadingAllInvit ||
                        (isLoadingSingleInvit &&
                          currentInvitation.id === invit.id)
                      "
                    >
                      <BIMDataSpinner />
                    </template>
                    <template v-else>
                      <BIMDataIconValidate fill color="success" size="s" />
                    </template>
                  </BIMDataButton>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="invitations__empty-div"></div>
  </div>
</template>

<script>
import { ref } from "vue";
import { fullName } from "../../utils/users.js";
import routeNames from "../../router/route-names.js";
import { useInvitations } from "../../state/invitations.js";
import { useInterval } from "../../composables/interval.js";
import { useStandardBreakpoints } from "../../composables/responsive.js";
import { INVITATION_STATUS } from "../../config/invitation.js";

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
    const {
      invitations,
      pendingInvitations,
      loadUserInvitations,
      acceptInvitations,
      declineInvitation,
    } = useInvitations();

    const currentInvitation = ref(null);
    const isLoadingAllInvit = ref(false);
    const isLoadingSingleInvit = ref(false);

    const onAcceptInvitations = async invitation => {
      if (invitation.id) {
        currentInvitation.value = invitation;
        isLoadingSingleInvit.value = true;
        await acceptInvitations([invitation]);
        isLoadingSingleInvit.value = false;
        currentInvitation.value = null;
      } else {
        isLoadingAllInvit.value = true;
        await acceptInvitations(pendingInvitations.value);
        isLoadingAllInvit.value = false;
      }
    };

    const onDenyInvitation = async invitation => {
      await declineInvitation(invitation);
    };

    useInterval(async () => await loadUserInvitations(), 5000);

    return {
      // references
      routeNames,
      invitations,
      INVITATION_STATUS,
      isLoadingAllInvit,
      currentInvitation,
      pendingInvitations,
      isLoadingSingleInvit,
      // methods
      fullName,
      onDenyInvitation,
      onAcceptInvitations,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./Invitations.scss"></style>
