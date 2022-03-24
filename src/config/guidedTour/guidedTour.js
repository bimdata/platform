import i18n from "../../i18n/index.js";
import IntroOutroPlatform from "./platform/IntroOutroPlatform.vue";

const { t } = i18n.global;

const tours = [
  {
    feature: "platform",
    steps: [
      {
        props: {
          title: t("GuidedTour.platform.intro.title"),
          content: t("GuidedTour.platform.intro.content"),
          img: "/static/guidedTour/platform/draw_intro.png"
        },
        layout: IntroOutroPlatform
      },
      {
        name: "actionButtons",
        target: ["btn-spaces", "btn-projects", "btn-subscriptions"],
        props: {
          title: t("GuidedTour.platform.actionButtons.title"),
          content: t("GuidedTour.platform.actionButtons.content")
        }
      },
      {
        name: "firstSpace",
        target: "dashboard-space",
        props: {
          title: t("GuidedTour.platform.firstSpace.title"),
          content: t("GuidedTour.platform.firstSpace.content")
        }
      },
      {
        name: "firstProject",
        clickable: true,
        target: "dashboard-project",
        props: {
          title: t("GuidedTour.platform.firstProject.title"),
          content: t("GuidedTour.platform.firstProject.content")
        }
      },
      {
        name: "modelsOverview",
        target: "preview-ifc",
        props: {
          title: t("GuidedTour.platform.previewIfc.title"),
          content: t("GuidedTour.platform.previewIfc.content")
        }
      },
      {
        name: "usersManager",
        target: "users-manager",
        props: {
          title: t("GuidedTour.platform.usersManager.title"),
          content: t("GuidedTour.platform.usersManager.content")
        }
      },
      {
        name: "modelsManager",
        target: "models-manager",
        props: {
          title: t("GuidedTour.platform.modelsManager.title"),
          content: t("GuidedTour.platform.modelsManager.content")
        }
      },
      {
        name: "gedButton",
        clickable: true,
        spotlightOffset: false,
        target: "project-tabs",
        targetDetail: "> ul > li:nth-child(2)",
        props: {
          title: t("GuidedTour.platform.gedButton.title"),
          content: t("GuidedTour.platform.gedButton.content")
        }
      },
      {
        name: "fileTree",
        target: ["btn-new-folder", "btn-upload-file", "file-tree"],
        props: {
          title: t("GuidedTour.platform.fileTree.title"),
          content: t("GuidedTour.platform.fileTree.content")
        }
      },
      {
        name: "groupManager",
        target: "btn-manage-groups",
        props: {
          title: t("GuidedTour.platform.groupManager.title"),
          content: t("GuidedTour.platform.groupManager.content")
        }
      },
      {
        name: "changeSpace",
        clickable: true,
        spotlightOffset: false,
        target: "btn-change-space",
        targetDetail: "> .breadcrumb-selector > div > div",
        props: {
          title: t("GuidedTour.platform.changeSpace.title"),
          content: t("GuidedTour.platform.changeSpace.content")
        }
      },
      {
        name: "outro",
        target: "btn-create-project",
        props: {
          title: t("GuidedTour.platform.outro.title"),
          content: t("GuidedTour.platform.outro.content"),
          img: "/static/guidedTour/platform/draw_outro.png"
        },
        layout: IntroOutroPlatform
      }
    ]
  }
];
export default tours;
