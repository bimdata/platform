<template>
  <div class="paddle-container"></div>
</template>

<script>
import { onMounted } from "vue";
export default {
  setup() {
    onMounted(() => {
      Paddle.Product.Prices(12403, function (prices) {
        // TODO: set price with with function instead of hard coded value
        console.log(prices);
      });
      Paddle.Checkout.open({
        method: "inline",
        product: 12403,
        email: "hugo@bimdata.io",
        title: "MY TITLE",
        message: "MY MESSAGE",
        disableLogout: true,
        frameTarget: "paddle-container",
        frameInitialHeight: 416,
        frameStyle: "width:100%; min-width:312px; background-color: transparent; border: none;",
        referring_domain: "platform self service",
        displayModeTheme: "dark",
      });
    });
  },
};
</script>
