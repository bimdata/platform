import { useStandardBreakpoints } from "../composables/responsive.js";
import { useSession } from "../composables/session.js";
import { DEFAULT_PROJECT_VIEW } from "../config/projects.js";
import i18n from "../i18n/index.js";

const { t } = i18n.global;
const { projectView } = useSession();
const { isMidXL } = useStandardBreakpoints();

const GUIDED_TOUR_ENABLED = ENV.VUE_APP_GUIDED_TOUR_ENABLED;
const IS_GUIDED_TOUR_ENABLED = GUIDED_TOUR_ENABLED === "true";

const IMG_PATH = "/static/guidedTour/platform/";
const TOUR_NAMES = Object.freeze({
  PLATFORM_INTRO: "PLATFORM_INTRO"
});

const tours = [
  {
    name: TOUR_NAMES.PLATFORM_INTRO,
    steps: [
      {
        props: {
          title: t("GuidedTour.platform.intro.title"),
          content: t("GuidedTour.platform.intro.content"),
          img: IMG_PATH + "intro.png",
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
          img: IMG_PATH + "actionButtons.gif",
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
          img: IMG_PATH + "firstSpace.gif",
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
          img: IMG_PATH + "firstProject.gif",
          imgPosition: "49% 50%",
          imgSize: "77%"
        },
        action: () => {
          const projects = document.querySelectorAll(
            "[data-guide=dashboard-project]"
          );
          const projectId = Array.from(projects).find(p => p.dataset.guideClick)
            .dataset.guideParam;
          projectView.set(parseInt(projectId, 10), DEFAULT_PROJECT_VIEW);
        }
      },
      {
        name: "modelsOverview",
        target: "preview-ifc",
        props: {
          title: t("GuidedTour.platform.previewIfc.title"),
          content: t("GuidedTour.platform.previewIfc.content"),
          img: IMG_PATH + "modelsOverview.gif",
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
          img: IMG_PATH + "usersManager.gif",
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
          img: IMG_PATH + "modelsManager.gif",
          imgPosition: "74% 38%",
          imgSize: "105%"
        }
      },
      {
        name: "gedButton",
        clickable: true,
        target: "project-tabs",
        targetDetail: "> ul > li:nth-child(2) > span",
        props: {
          title: t("GuidedTour.platform.gedButton.title"),
          content: t("GuidedTour.platform.gedButton.content"),
          img: IMG_PATH + "gedButton.gif",
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
          img: IMG_PATH + "fileTree.gif",
          imgPosition: "-16% 62%",
          imgSize: "167%"
        }
      },
      {
        name: "groupManager",
        target: "btn-manage-groups",
        props: {
          title: t("GuidedTour.platform.groupManager.title"),
          content: t("GuidedTour.platform.groupManager.content"),
          img: IMG_PATH + "groupManager.gif",
          imgPosition: "45% -18%",
          imgSize: "96%"
        }
      },
      {
        name: "changeSpace",
        clickable: true,
        target: "btn-change-space",
        targetDetail: isMidXL.value ? "" : "> .breadcrumb-selector > div > div",
        props: {
          title: t("GuidedTour.platform.changeSpace.title"),
          content: t("GuidedTour.platform.changeSpace.content"),
          img: IMG_PATH + "changeSpace.gif",
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
          img: IMG_PATH + "outro.png",
          imgPosition: "2% 50%",
          imgSize: "93%"
        }
      }
    ]
  }
];

export { IS_GUIDED_TOUR_ENABLED, TOUR_NAMES, tours };
