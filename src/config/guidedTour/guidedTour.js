import IntroPlatform from "./platform/IntroPlatform.vue";

const tours = [
  {
    feature: "platform",
    steps: [
      {
        props: {
          title: "Welcome my friend",
          content:
            "Here is your starting to point to the future, are you ready ?"
        },
        layout: IntroPlatform
      },
      {
        target: "space-button",
        props: {
          title: "SPACE BUTTON",
          content: "this is where your differents spaces are"
        }
      },
      {
        target: "project-button",
        clickable: true,
        props: {
          title: "PROJECT BUTTON",
          content: "click on the button to come in the section"
        }
      },
      {
        target: "project-input-search",
        props: {
          title: "PROJECT INPUT SEARCH",
          content: "you can looking for a specific project typing it name"
        }
      }
    ]
  }
];
export default tours;
