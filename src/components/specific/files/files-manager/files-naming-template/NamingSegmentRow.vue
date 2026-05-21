<template>
  <div class="seg-row">
    <!-- Drag handle -->
    <div class="seg-row__drag">
      <BIMDataIcon name="drag" size="xs" />
    </div>

    <!-- Separator indicator (not for first segment) -->
    <div v-if="index > 0" class="seg-row__sep">{{ separator }}</div>

    <!-- Type badge -->
    <div class="seg-row__type" :class="`seg-row__type--${segment.type}`">
      {{ typeLabel }}
    </div>

    <!-- Config inputs -->
    <div class="seg-row__config">
      <!-- N caractères -->
      <template v-if="segment.type === 'n_chars'">
        <BIMDataInput
          :value="segment.config.min"
          placeholder="Min"
          type="number"
          size="s"
          class="seg-row__input seg-row__input--sm"
          @input="updateConfig('min', $event.target.value)"
        />
        <span class="seg-row__range-sep">–</span>
        <BIMDataInput
          :value="segment.config.max"
          placeholder="Max"
          type="number"
          size="s"
          class="seg-row__input seg-row__input--sm"
          @input="updateConfig('max', $event.target.value)"
        />
      </template>

      <!-- Valeurs bornées -->
      <template v-else-if="segment.type === 'bounded'">
        <BIMDataInput
          :value="segment.config.min"
          placeholder="Min"
          type="number"
          size="s"
          class="seg-row__input seg-row__input--sm"
          @input="updateConfig('min', Number($event.target.value))"
        />
        <span class="seg-row__range-sep">–</span>
        <BIMDataInput
          :value="segment.config.max"
          placeholder="Max"
          type="number"
          size="s"
          class="seg-row__input seg-row__input--sm"
          @input="updateConfig('max', Number($event.target.value))"
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
          <option
            v-for="list in customLists"
            :key="list.id"
            :value="list.id"
          >
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
      <button
        class="seg-row__action"
        :disabled="index === 0"
        @click="$emit('move-up')"
        title="Monter"
      >
        <BIMDataIcon name="chevron" size="xs" style="transform: rotate(180deg)" />
      </button>
      <button
        class="seg-row__action"
        @click="$emit('move-down')"
        title="Descendre"
      >
        <BIMDataIcon name="chevron" size="xs" />
      </button>
      <button class="seg-row__action seg-row__action--delete" @click="$emit('remove')" title="Supprimer">
        <BIMDataIcon name="delete" size="xs" />
      </button>
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
    case "n_chars": return "N car.";
    case "bounded": return "Borné";
    case "list": return "Liste";
    default: return "?";
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

<style lang="scss" scoped>
.seg-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: var(--color-silver-lighter);
  border-radius: 6px;
  border: 1px solid var(--color-silver-light);

  &__drag {
    cursor: grab;
    color: var(--color-granite-light);
    flex-shrink: 0;
  }

  &__sep {
    font-family: monospace;
    font-size: 14px;
    font-weight: 700;
    color: var(--color-granite);
    flex-shrink: 0;
    min-width: 14px;
    text-align: center;
  }

  &__type {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 12px;
    flex-shrink: 0;
    white-space: nowrap;

    &--n_chars {
      background: #e8f4fd;
      color: #1a73e8;
    }
    &--bounded {
      background: #fef3e2;
      color: #f57c00;
    }
    &--list {
      background: #e8f5e9;
      color: #2e7d32;
    }
  }

  &__config {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__input {
    &--sm {
      width: 64px;
    }
  }

  &__range-sep {
    color: var(--color-granite);
    font-size: 12px;
  }

  &__select {
    flex: 1;
    padding: 5px 8px;
    border: 1px solid var(--color-silver);
    border-radius: 4px;
    font-size: 12px;
    background: white;
    color: var(--color-granite-dark);

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }

  &__manage-list {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-granite);
    padding: 4px;
    display: flex;
    align-items: center;

    &:hover {
      color: var(--color-primary);
    }
  }

  &__actions {
    display: flex;
    gap: 2px;
    flex-shrink: 0;
  }

  &__action {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-granite);
    padding: 4px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    transition: all 0.1s;

    &:hover:not(:disabled) {
      background: var(--color-silver-light);
      color: var(--color-granite-dark);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    &--delete:hover:not(:disabled) {
      background: var(--color-red-lighter);
      color: var(--color-red);
    }
  }
}
</style>
