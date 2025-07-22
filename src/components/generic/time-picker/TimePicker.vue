<template>
  <div class="time-picker" ref="pickerRef">
    <input
      type="text"
      :name="`time-picker-${modelValue}`"
      v-model="inputValue"
      @focus="showCarousel = true"
      @keydown.enter.prevent="onManualInputConfirm"
      placeholder="HH:mm"
    />

    <div v-if="showCarousel" class="carousel">
      <BIMDataButton
        color="primary"
        ghost
        radius
        icon
        :disabled="!canScrollUp"
        @click.stop="scrollUp"
        width="100%"
        height="26px"
      >
        <BIMDataIconChevron fill color="granite" :rotate="270" size="xxs" />
      </BIMDataButton>

      <div class="carousel-content">
        <div
          v-for="time in visibleRange"
          :key="time"
          :class="['time-option', { selected: time === modelValue }]"
          @click="selectTime(time)"
        >
          {{ time }}
        </div>
      </div>

      <BIMDataButton
        color="primary"
        ghost
        radius
        icon
        :disabled="!canScrollDown"
        @click.stop="scrollDown"
        width="100%"
        height="26px"
      >
        <BIMDataIconChevron fill color="granite" :rotate="90" size="xxs" />
      </BIMDataButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const modelValue = defineModel({ type: String, default: '08:00' })

const pickerRef = ref(null)
const showCarousel = ref(false)
const baseIndex = ref(0)

const timeOptions = ref(generateTimes())

const inputValue = computed({
  get: () => modelValue.value,
  set: (val) => {
    inputBuffer.value = val
  },
})

const inputBuffer = ref(modelValue.value)

function generateTimes() {
  const times = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
    }
  }
  return times
}

const visibleRange = computed(() => {
  const totalVisible = 5
  const maxIndex = timeOptions.value.length - 1

  let start = baseIndex.value - Math.floor(totalVisible / 2)
  let end = start + totalVisible

  if (start < 0) {
    start = 0
    end = totalVisible
  }

  if (end > maxIndex + 1) {
    end = maxIndex + 1
    start = end - totalVisible
    if (start < 0) start = 0
  }

  return timeOptions.value.slice(start, end)
})

const canScrollUp = computed(() => baseIndex.value > 2)
const canScrollDown = computed(() => baseIndex.value < timeOptions.value.length - 3)

watch(modelValue, (newVal) => {
  inputBuffer.value = newVal
  const index = timeOptions.value.findIndex((t) => t === newVal)
  if (index !== -1) baseIndex.value = index
}, { immediate: true })

function selectTime(time) {
  modelValue.value = time
  inputBuffer.value = time
  showCarousel.value = false
}

function onManualInputConfirm() {
  const valid = /^([01]\d|2[0-3]):(00|30)$/.test(inputBuffer.value)
  if (valid) {
    modelValue.value = inputBuffer.value
  } else {
    inputBuffer.value = modelValue.value
  }
  showCarousel.value = false
}

function handleClickOutside(event) {
  if (pickerRef.value && !pickerRef.value.contains(event.target)) {
    showCarousel.value = false
  }
}

function scrollUp() {
  if (baseIndex.value > 0) baseIndex.value--
}
function scrollDown() {
  if (baseIndex.value < timeOptions.value.length - 1) baseIndex.value++
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped src="./TimePicker.css"></style>
