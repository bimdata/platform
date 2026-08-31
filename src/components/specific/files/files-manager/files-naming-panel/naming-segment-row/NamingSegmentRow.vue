<template>
  <div class="seg-row">
    <!-- Drag handle -->
    <div class="seg-row__drag">
      <BIMDataIcon name="drag" size="s" />
    </div>

    <!-- Type badge -->
    <div class="seg-row__type" :class="`seg-row__type--${segment.type}`">
      {{ typeLabel }}
    </div>

    <!-- Config inputs -->
    <div class="seg-row__config">
      <!-- N caractères -->
      <template v-if="segment.type === 'n_chars'">
        <BIMDataInput
          :model-value="segment.config.min"
          placeholder="Min"
          type="number"
          class="seg-row__input seg-row__input--sm"
          @update:model-value="updateConfig('min', $event)"
        />
        <span class="seg-row__range-sep">–</span>
        <BIMDataInput
          :model-value="segment.config.max"
          placeholder="Max"
          type="number"
          class="seg-row__input seg-row__input--sm"
          @update:model-value="updateConfig('max', $event)"
        />
      </template>

      <!-- Valeurs bornées -->
      <template v-else-if="segment.type === 'bounded'">
        <BIMDataInput
          :model-value="segment.config.min"
          placeholder="Min"
          type="number"
          class="seg-row__input seg-row__input--sm"
          @update:model-value="updateConfig('min', Number($event))"
        />
        <span class="seg-row__range-sep">–</span>
        <BIMDataInput
          :model-value="segment.config.max"
          placeholder="Max"
          type="number"
          class="seg-row__input seg-row__input--sm"
          @update:model-value="updateConfig('max', Number($event))"
        />
      </template>

      <!-- Liste -->
      <template v-else-if="segment.type === 'list'">
        <select
          class="seg-row__select"
          :value="segment.config.listId"
          @change="onListSelect($event.target.value)"
        >
          <option value="">Select de la liste</option>
          <option v-for="list in customLists" :key="list.id" :value="list.id">
            {{ list.name }}
          </option>
        </select>
        <button class="seg-row__manage-list" @click="$emit('manage-list')">
          <BIMDataIcon name="settings" size="xs" />
        </button>
      </template>
    </div>

    <!-- Actions -->
    <div class="seg-row__actions">
      <BIMDataButton
        color="granite"
        ghost
        rounded
        icon
        class="seg-row__action"
        :disabled="index === 0"
        @click="$emit('move-up')"
        title="Monter"
      >
        <BIMDataIcon name="chevron" size="xxs" style="transform: rotate(180deg)" />
      </BIMDataButton>
      <BIMDataButton
        color="granite"
        ghost
        rounded
        icon
        class="seg-row__action"
        @click="$emit('move-down')"
        title="Descendre"
      >
        <BIMDataIcon name="chevron" size="xxs" />
      </BIMDataButton>
      <BIMDataButton
        color="high"
        ghost
        rounded
        icon
        class="seg-row__action seg-row__action--delete"
        @click="$emit('remove')"
        title="Supprimer"
      >
        <BIMDataIcon name="delete" fill size="xs" color="high" />
      </BIMDataButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  segment: { type: Object, required: true },
  index: { type: Number, required: true },
  separator: { type: String, default: "-" },
  customLists: { type: Array, default: () => [] },
});

const emit = defineEmits(["update", "remove", "move-up", "move-down", "manage-list"]);

const typeLabel = computed(() => {
  switch (props.segment.type) {
    case "n_chars":
      return "N car.";
    case "bounded":
      return "Borné";
    case "list":
      return "Liste";
    default:
      return "?";
  }
});

function updateConfig(key, value) {
  emit("update", {
    config: { ...props.segment.config, [key]: value },
  });
}

function onListSelect(listId) {
  const list = props.customLists.find((l) => l.id === listId);
  emit("update", {
    config: {
      ...props.segment.config,
      listId,
      values: list?.values || [],
    },
  });
}
</script>

<style lang="scss" scoped src="./NamingSegmentRow.scss"></style>
