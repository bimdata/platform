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
        props: {
          title: "Now, it's your turn",
          content: "have a good day",
          img: "/static/guidedTour/platform/draw_outro.png"
        },
        layout: IntroOutroPlatform
      }
    ]
  }
];
export default tours;
