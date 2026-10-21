<template>
  <BIMDataSafeZoneModal class="naming-part-list-in-use-modal" width="600px">
    <template #icon>
      <div class="header flex flex-col items-center">
        <div class="icon flex items-center m-b-12">
          <BIMDataIconWarning fill color="high" />
        </div>
        <div class="flex flex-col items-center">
          <strong>
            {{ $t("NamingConstraint.partListInUseModal.title") }}
          </strong>
          <span>
            {{ $t("NamingConstraint.partListInUseModal.description") }}
          </span>
        </div>
      </div>
    </template>

    <template #text>
      <div class="naming-part-list-in-use-modal__content">
        <p>
          {{ $t("NamingConstraint.partListInUseModal.listLabel") }}
          <strong>{{ partList?.name }}</strong>
        </p>

        <div>
          <p>
            {{ $t("NamingConstraint.partListInUseModal.rulesDescription") }}
          </p>
          <ul class="bimdata-list naming-part-list-in-use-modal__rules">
            <li
              v-for="(constraint, index) in constraints"
              :key="constraint.id ?? constraint.name ?? index"
            >
              {{ constraint.name }}
            </li>
          </ul>
        </div>

        <p class="naming-part-list-in-use-modal__hint">
          {{ $t("NamingConstraint.partListInUseModal.resolution") }}
        </p>
      </div>
    </template>

    <template #actions>
      <BIMDataButton color="primary" fill radius width="120px" @click="close">
        {{ $t("t.close") }}
      </BIMDataButton>
    </template>
  </BIMDataSafeZoneModal>
</template>

<script>
export default {
  props: {
    partList: {
      type: Object,
      required: true,
    },
    constraints: {
      type: Array,
      default: () => [],
    },
    onClose: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const close = () => props.onClose();

    return {
      close,
    };
  },
};
</script>

<style scoped src="./NamingPartListInUseModal.css"></style>
