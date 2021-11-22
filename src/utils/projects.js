import PROJECT_STATUSES from "@/config/project-statuses.js";

function status(project) {
  const today = new Date();
  const createDate = new Date(project.createdAt);
  const updateDate = new Date(project.updatedAt);

  const newDateLimit = new Date(today);
  newDateLimit.setDate(
    today.getDate() - +process.env.VUE_APP_PROJECT_STATUS_LIMIT_NEW
  );
  const activeDateLimit = new Date(today);
  activeDateLimit.setDate(
    today.getDate() - +process.env.VUE_APP_PROJECT_STATUS_LIMIT_ACTIVE
  );

  if (createDate.getTime() > newDateLimit.getTime()) {
    return PROJECT_STATUSES.NEW;
  } else if (updateDate.getTime() > activeDateLimit.getTime()) {
    return PROJECT_STATUSES.ACTIVE;
  } else {
    return PROJECT_STATUSES.INACTIVE;
  }
}

export { status };
