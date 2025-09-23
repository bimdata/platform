export const WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const RAW_ACTIVITY_OPTIONS = {
  ged: [
    "ged.fileUpload",
    "ged.fileDeletion",
    // "ged.newVersion",
    "ged.folderCreation",
    "ged.folderDeletion",
  ],
  visa: [
    "visa.visaCreation",
    "visa.visaDeletion",
    "visa.visaValidation",
    "visa.visaRejection",
  ],
  bcf: [
    "bcf.bcfCreation",
    "bcf.bcfDeletion",
  ],
  otherEvents: [
    "otherEvents.acceptInvit",
    // "otherEvents.removeModels",
    "otherEvents.createMetaBuilding",
    "otherEvents.deleteMetaBuilding",
  ],
};

export const getDaysLabels = (t) =>
  Object.fromEntries(WEEK_DAYS.map((dayKey) => [
    dayKey,
    t(`ProjectOverview.notifications.settings.general.${dayKey}`),
  ]));

export const getDefaultCheckedDays = () =>
  Object.fromEntries(WEEK_DAYS.map((dayKey) => [dayKey, false]));

export const getDefaultCheckedActivity = () => {
  const allKeys = Object.values(RAW_ACTIVITY_OPTIONS).flat();
  return Object.fromEntries(allKeys.map((key) => [key, false]));
};

export const getActivityOptions = (t) =>
  Object.fromEntries(
    Object.entries(RAW_ACTIVITY_OPTIONS).map(([section, keys]) => [
      section,
      keys.map((key) =>
        t(`ProjectOverview.notifications.settings.activity.${key}`)
      ),
    ])
  );

  export const getActivityMapping = () => ({
  "ged.fileUpload": "document_creation",
  "ged.fileDeletion": "document_deletion",
  // "ged.newVersion": "document_new_version",
  "ged.folderCreation": "folder_creation",
  "ged.folderDeletion": "folder_deletion",
  "visa.visaCreation": "visa_creation",
  "visa.visaDeletion": "visa_deletion",
  "visa.visaValidation": "visa_validation",
  "visa.visaRejection": "visa_denied",
  "bcf.bcfCreation": "bcf_topic_creation",
  "bcf.bcfDeletion": "bcf_topic_deletion",
  "otherEvents.acceptInvit": "invitation_accepted",
  // "otherEvents.removeModels": "model_removed",
  "otherEvents.createMetaBuilding": "model_creation",
  "otherEvents.deleteMetaBuilding": "model_deletion",
});
