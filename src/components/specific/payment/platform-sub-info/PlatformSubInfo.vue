<template>
  <div class="platform-sub-info">
    <img class="heading" :src="heading" alt="BIMData Platform" />
    <h1 class="title">
      {{ $t("PlatformSubInfo.title") }}
    </h1>
    <h3 class="sub-title">
      {{ $t("PlatformSubInfo.subTitle") }}
    </h3>
    <div class="price">
      <span>45€</span>
      <span>/{{ $t("PlatformSubInfo.month") }}</span>
    </div>
    <div class="bullet-list">
      <div class="bullets-head">
        {{ $t("PlatformSubInfo.bulletsHead") }}
      </div>
      <div class="bullet">
        <img :src="bulletMark" />
        {{ $t("PlatformSubInfo.bullet1") }}
      </div>
      <div class="bullet">
        <img :src="bulletMark" />
        {{ $t("PlatformSubInfo.bullet2") }}
      </div>
      <div class="bullet">
        <img :src="bulletMark" />
        {{ $t("PlatformSubInfo.bullet3") }}
      </div>
      <div class="bullet">
        <img :src="bulletMark" />
        {{ $t("PlatformSubInfo.bullet4") }}
      </div>
      <div class="bullet">
        <img :src="bulletMark" />
        {{ $t("PlatformSubInfo.bullet5") }}
      </div>
      <div class="bullet">
        <img :src="bulletMark" />
        {{ $t("PlatformSubInfo.bullet6") }}
      </div>
      <div class="bullet">
        <img :src="bulletMark" />
        {{ $t("PlatformSubInfo.bullet7") }}
      </div>
      <div class="bullet">
        <img :src="bulletMark" />
        {{ $t("PlatformSubInfo.bullet8") }}
      </div>
      <div class="bullet">
        <img :src="bulletMark" />
        {{ $t("PlatformSubInfo.bullet9") }}
      </div>
      <div class="bullet">
        <img :src="bulletMark" />
        {{ $t("PlatformSubInfo.bullet10") }}
      </div>
    </div>
  </div>
</template>

<script>
import heading from "./heading.svg";
import bulletMark from "./bullet-mark.svg";

export default {
  setup() {
    return {
      bulletMark,
      heading
    };
  }
};
</script>

<style scoped lang="scss" src="./PlatformSubInfo.scss"></style>
