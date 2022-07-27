import i18n from "../../i18n/index.js";
import { useSession } from "@/composables/session.js";
import { DEFAULT_PROJECT_VIEW } from "@/config/projects.js";
import { useCustomBreakpoints } from "@/composables/responsive.js";

const { t } = i18n.global;
const imgPath = "/static/guidedTour/platform/";

const { projectView } = useSession();

const TOURS_NAME = Object.freeze({
  PLATFORM_INTRO: "PLATFORM_INTRO"
});

const { isMidXL } = useCustomBreakpoints({
  isMidXL: ({ width }) => width <= 1132 - 0.02
});

const tours = [
  {
    name: TOURS_NAME.PLATFORM_INTRO,
    steps: [
      {
        props: {
          title: t("GuidedTour.platform.intro.title"),
          content: t("GuidedTour.platform.intro.content"),
          img: imgPath + "intro.png",
          imgPosition: "-20% 50%",
          imgSize: "116%"
        }
      },
      {
        name: "actionButtons",
        target: ["btn-spaces", "btn-projects", "btn-subscriptions"],
        props: {
          title: t("GuidedTour.platform.actionButtons.title"),
          content: t("GuidedTour.platform.actionButtons.content"),
          img: imgPath + "actionButtons.gif",
          imgPosition: "-20% 50%", // horizontal vertical
          imgSize: "116%"
        }
      },
      {
        name: "firstSpace",
        target: "dashboard-space",
        props: {
          title: t("GuidedTour.platform.firstSpace.title"),
          content: t("GuidedTour.platform.firstSpace.content"),
          img: imgPath + "firstSpace.gif",
          imgPosition: "-13% 48%",
          imgSize: "150%"
        }
      },
      {
        name: "firstProject",
        clickable: true,
        target: "dashboard-project",
        targetToClick: "dashboard-project",
        props: {
          title: t("GuidedTour.platform.firstProject.title"),
          content: t("GuidedTour.platform.firstProject.content"),
          img: imgPath + "firstProject.gif",
          imgPosition: "49% 50%",
          imgSize: "77%"
        },
        actions: {
          projectTab: projectId => {
            projectView.set(projectId, DEFAULT_PROJECT_VIEW);
          }
        }
      },
      {
        name: "modelsOverview",
        target: "preview-ifc",
        props: {
          title: t("GuidedTour.platform.previewIfc.title"),
          content: t("GuidedTour.platform.previewIfc.content"),
          img: imgPath + "modelsOverview.gif",
          imgPosition: "114% 103%",
          imgSize: "83%"
        }
      },
      {
        name: "usersManager",
        target: "users-manager",
        props: {
          title: t("GuidedTour.platform.usersManager.title"),
          content: t("GuidedTour.platform.usersManager.content"),
          img: imgPath + "usersManager.gif",
          imgPosition: "126% 108%",
          imgSize: "98%"
        }
      },
      {
        name: "modelsManager",
        target: "models-manager",
        props: {
          title: t("GuidedTour.platform.modelsManager.title"),
          content: t("GuidedTour.platform.modelsManager.content"),
          img: imgPath + "modelsManager.gif",
          imgPosition: "74% 38%",
          imgSize: "105%"
        }
      },
      {
        name: "gedButton",
        clickable: true,
        target: "project-tabs",
        targetDetail: "> ul > li:nth-child(2)",
        yOffset: -65,
        xOffset: -33,
        props: {
          title: t("GuidedTour.platform.gedButton.title"),
          content: t("GuidedTour.platform.gedButton.content"),
          img: imgPath + "gedButton.gif",
          imgPosition: "-5% 54%",
          imgSize: "300%"
        }
      },
      {
        name: "fileTree",
        target: ["btn-new-folder", "btn-upload-file", "file-tree"],
        props: {
          title: t("GuidedTour.platform.fileTree.title"),
          content: t("GuidedTour.platform.fileTree.content"),
          img: imgPath + "fileTree.gif",
          imgPosition: "-16% 62%",
          imgSize: "167%"
        }
      },
      {
        name: "groupManager",
        target: "btn-manage-groups",
        yOffset: -65,
        props: {
          title: t("GuidedTour.platform.groupManager.title"),
          content: t("GuidedTour.platform.groupManager.content"),
          img: imgPath + "groupManager.gif",
          imgPosition: "45% -18%",
          imgSize: "96%"
        }
      },
      {
        name: "changeSpace",
        clickable: true,
        target: "btn-change-space",
        targetDetail: isMidXL.value ? "" : "> .breadcrumb-selector > div > div",
        yOffset: isMidXL.value ? -65 : -72,
        xOffset: isMidXL.value ? -12 : 17,
        props: {
          title: t("GuidedTour.platform.changeSpace.title"),
          content: t("GuidedTour.platform.changeSpace.content"),
          img: imgPath + "changeSpace.gif",
          imgPosition: "-10% 77%",
          imgSize: "210%"
        }
      },
      {
        name: "outro",
        target: "btn-create-project",
        props: {
          title: t("GuidedTour.platform.outro.title"),
          content: t("GuidedTour.platform.outro.content"),
          img: imgPath + "outro.png",
          imgPosition: "2% 50%",
          imgSize: "93%"
        }
      }
    ]
  }
];
export { tours, TOURS_NAME };
