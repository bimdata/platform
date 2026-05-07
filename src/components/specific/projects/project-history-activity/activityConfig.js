import { PROJECT_ROLE } from "../../../../config/projects.js";

const roleMap = {
  [PROJECT_ROLE.ADMIN]: "admin",
  [PROJECT_ROLE.USER]: "user",
  [PROJECT_ROLE.GUEST]: "guest",
};

const getFileName = (path) => path?.split("/").pop() || "";

const ACTION_CONFIG = {
  document_created: {
    actionKey: "ProjectOverview.activity.document_created",
    getTarget: (log) => getFileName(log.description?.path),
    icon: "DocumentCreated",
    class: "blue",
    badgeKey: "ProjectOverview.activity.badge.document_created",
  },

  document_deleted: {
    actionKey: "ProjectOverview.activity.document_deleted",
    getTarget: (log) => getFileName(log.description?.path),
    icon: "DocumentDeleted",
    class: "flame",
    badgeKey: "ProjectOverview.activity.badge.document_deleted",
  },

  document_renamed: {
    actionKey: "ProjectOverview.activity.document_renamed",
    getTarget: (log) => getFileName(log.description?.old_path),
    params: (log) => ({
      oldName: getFileName(log.description?.old_path),
      newName: getFileName(log.description?.new_path),
    }),
    icon: "DocumentRenamed",
    class: "purple",
    badgeKey: "ProjectOverview.activity.badge.document_renamed",
  },

  document_moved: {
    actionKey: "ProjectOverview.activity.document_moved",
    getTarget: (log) => log.project_name,
    icon: "DocumentMoved",
    class: "teal",
    badgeKey: "ProjectOverview.activity.badge.document_moved",
  },

  folder_created: {
    actionKey: "ProjectOverview.activity.folder_created",
    getTarget: (log) => getFileName(log.description?.path),
    icon: "FolderCreated",
    class: "blue",
    badgeKey: "ProjectOverview.activity.badge.folder_created",
  },

  folder_deleted: {
    actionKey: "ProjectOverview.activity.folder_deleted",
    getTarget: (log) => getFileName(log.description?.path),
    icon: "FolderDeleted",
    class: "flame",
    badgeKey: "ProjectOverview.activity.badge.folder_deleted",
  },

  folder_renamed: {
    actionKey: "ProjectOverview.activity.folder_renamed",
    getTarget: (log) => getFileName(log.description?.old_path),
    params: (log) => ({
      oldName: getFileName(log.description?.old_path),
      newName: getFileName(log.description?.new_path),
    }),
    icon: "FolderRenamed",
    class: "purple",
    badgeKey: "ProjectOverview.activity.badge.folder_renamed",
  },

  folder_moved: {
    actionKey: "ProjectOverview.activity.folder_moved",
    getTarget: (log) => log.description?.old_path,
    params: (log) => ({
      oldPath: log.description?.old_path,
      newPath: log.description?.new_path,
    }),
    icon: "FolderMoved",
    class: "teal",
    badgeKey: "ProjectOverview.activity.badge.folder_moved",
  },

  folder_permissions_updated: {
    actionKey: "ProjectOverview.activity.folder_permissions_updated",
    getTarget: (log) => getFileName(log.description?.path),
    params: (log) => ({
      folderName: getFileName(log.description?.path),
    }),
    icon: "FolderPermissionsUpdated",
    class: "pink",
    badgeKey: "ProjectOverview.activity.badge.folder_permissions_updated",
  },

  cloud_invitation_sent: {
    actionKey: "ProjectOverview.activity.cloud_invitation_sent",
    getTarget: (log) => log.description?.email,
    icon: "CloudInvitationSent",
    class: "middle-blue",
    badgeKey: "ProjectOverview.activity.badge.cloud_invitation_sent",
  },

  cloud_invitation_canceled: {
    actionKey: "ProjectOverview.activity.cloud_invitation_canceled",
    getTarget: (log) => log.description?.email,
    icon: "CloudInvitationCancelled",
    class: "orange",
    badgeKey: "ProjectOverview.activity.badge.cloud_invitation_canceled",
  },

  cloud_invitation_accepted: {
    actionKey: "ProjectOverview.activity.cloud_invitation_accepted",
    getTarget: (log) => log.description?.email,
    icon: "CloudInvitationAccepted",
    class: "green",
    badgeKey: "ProjectOverview.activity.badge.cloud_invitation_accepted",
  },

  cloud_invitation_denied: {
    actionKey: "ProjectOverview.activity.cloud_invitation_denied",
    getTarget: (log) => log.description?.email,
    icon: "CloudInvitationDenied",
    class: "red",
    badgeKey: "ProjectOverview.activity.badge.cloud_invitation_denied",
  },

  project_invitation_sent: {
    actionKey: "ProjectOverview.activity.project_invitation_sent",
    getTarget: (log) => log.description?.invited_email,
    icon: "ProjectInvitationSent",
    class: "middle-blue",
    badgeKey: "ProjectOverview.activity.badge.project_invitation_sent",
  },

  project_invitation_canceled: {
    actionKey: "ProjectOverview.activity.project_invitation_canceled",
    getTarget: (log) => log.description?.email,
    icon: "ProjectInvitationCancelled",
    class: "orange",
    badgeKey: "ProjectOverview.activity.badge.project_invitation_canceled",
  },

  project_invitation_accepted: {
    actionKey: "ProjectOverview.activity.project_invitation_accepted",
    getTarget: (log) => log.user_email,
    params: (log) => ({
      senderEmail: log.sender_email,
    }),
    icon: "ProjectInvitationAccepted",
    class: "green",
    badgeKey: "ProjectOverview.activity.badge.project_invitation_accepted",
  },

  project_invitation_denied: {
    actionKey: "ProjectOverview.activity.project_invitation_denied",
    getTarget: (log) => log.description?.email,
    icon: "ProjectInvitationDenied",
    class: "red",
    badgeKey: "ProjectOverview.activity.badge.project_invitation_denied",
  },
};

export const getActivityFromLog = (log) => {
  const config = ACTION_CONFIG[log.action] || ACTION_CONFIG.default;

  if (!config) {
    return null;
  }

  const roleKey = roleMap[log.description?.project_role];

  return {
    actionKey: config.actionKey,
    target: config.getTarget?.(log),
    userEmail: log.description?.sender_email || log.user_email,
    params: config.params?.(log),
    icon: config.icon,
    class: config.class,
    badgeKey: config.badgeKey,

    details: {
      path: log.description?.path,
      roleKey,
      oldName: getFileName(log.description?.old_path),
      newName: getFileName(log.description?.new_path),
      oldPath: log.description?.old_path,
      newPath: log.description?.new_path,
    },
  };
};
