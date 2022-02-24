import IntroOutroPlatform from "./platform/IntroOutroPlatform.vue";

const tours = [
  {
    feature: "platform",
    steps: [
      {
        props: {
          title: "Welcome my friend",
          content: "Lets explore the features",
          img: "/static/guidedTour/platform/draw_intro.png"
        },
        layout: IntroOutroPlatform
      },
      {
        target: "space-button",
        props: {
          title: "SPACE BUTTON",
          content:
            "this is where your differents spaces are, you will have the time to explore "
        }
      },
      {
        target: "project-button",
        clickable: true,
        props: {
          title: "PROJECT BUTTON",
          content: "click on the button to reach the section"
        }
      },
      {
        target: "project-input-search",
        props: {
          title: "PROJECT INPUT SEARCH",
          content: "you can looking for a specific project typing it name"
        }
      },
      {
        target: "project-card",
        clickable: true,
        props: {
          title: "PROJECT CARD",
          content: "click in here to acces the project"
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
