export const getDefaultCheckedDays = (t) =>
  Object.fromEntries(
    [
      t("ProjectOverview.notifications.settings.general.monday"),
      t("ProjectOverview.notifications.settings.general.tuesday"),
      t("ProjectOverview.notifications.settings.general.wednesday"),
      t("ProjectOverview.notifications.settings.general.thursday"),
      t("ProjectOverview.notifications.settings.general.friday"),
      t("ProjectOverview.notifications.settings.general.saturday"),
      t("ProjectOverview.notifications.settings.general.sunday"),
    ].map((day) => [day, false])
  );

export const getDefaultCheckedActivity = (t) =>
  Object.fromEntries(
    [
      t("ProjectOverview.notifications.settings.activity.ged.fileUpload"),
      t("ProjectOverview.notifications.settings.activity.ged.fileDeletion"),
      t("ProjectOverview.notifications.settings.activity.ged.newVersion"),
      t("ProjectOverview.notifications.settings.activity.ged.folderCreation"),
      t("ProjectOverview.notifications.settings.activity.ged.folderDeletion"),
      t("ProjectOverview.notifications.settings.activity.visa.visaCreation"),
      t("ProjectOverview.notifications.settings.activity.visa.visaDeletion"),
      t("ProjectOverview.notifications.settings.activity.visa.visaValidation"),
      t("ProjectOverview.notifications.settings.activity.visa.visaRejection"),
      t("ProjectOverview.notifications.settings.activity.bcf.bcfCreation"),
      t("ProjectOverview.notifications.settings.activity.bcf.bcfDeletion"),
      t("ProjectOverview.notifications.settings.activity.otherEvents.acceptInvit"),
      t("ProjectOverview.notifications.settings.activity.otherEvents.removeModels"),
      t("ProjectOverview.notifications.settings.activity.otherEvents.createMetaBuilding"),
      t("ProjectOverview.notifications.settings.activity.otherEvents.deleteMetaBuilding"),
    ].map((label) => [label, false])
  );

export const getActivityMapping = (t) => ({
  [t("ProjectOverview.notifications.settings.activity.ged.fileUpload")]: "document_creation",
  [t("ProjectOverview.notifications.settings.activity.ged.fileDeletion")]: "document_deletion",
  [t("ProjectOverview.notifications.settings.activity.ged.folderCreation")]: "folder_creation",
  [t("ProjectOverview.notifications.settings.activity.ged.folderDeletion")]: "folder_deletion",
  [t("ProjectOverview.notifications.settings.activity.visa.visaCreation")]: "visa_creation",
  [t("ProjectOverview.notifications.settings.activity.visa.visaDeletion")]: "visa_deletion",
  [t("ProjectOverview.notifications.settings.activity.visa.visaValidation")]: "visa_validation",
  [t("ProjectOverview.notifications.settings.activity.visa.visaRejection")]: "visa_denied",
  [t("ProjectOverview.notifications.settings.activity.bcf.bcfCreation")]: "bcf_topic_creation",
  [t("ProjectOverview.notifications.settings.activity.bcf.bcfDeletion")]: "bcf_topic_deletion",
  [t("ProjectOverview.notifications.settings.activity.otherEvents.acceptInvit")]:
    "invitation_accepted",
  [t("ProjectOverview.notifications.settings.activity.otherEvents.removeModels")]: "model_removed",
  [t("ProjectOverview.notifications.settings.activity.otherEvents.createMetaBuilding")]:
    "model_creation",
  [t("ProjectOverview.notifications.settings.activity.otherEvents.deleteMetaBuilding")]:
    "model_deletion",
});
