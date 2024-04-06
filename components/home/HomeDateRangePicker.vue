<script setup lang="ts">
import { sub, format, isSameDay, type Duration } from 'date-fns'
import type { Range } from '~/types'

const ranges = [
  { label: 'الاسبوع الماضى', duration: { days: 7 } },
  { label: 'اخر 14 يوم', duration: { days: 14 } },
  { label: 'اخر 30 يوم(شهر)', duration: { days: 30 } },
  { label: 'اخر 3 شهور', duration: { months: 3 } },
  { label: 'اخر 6 شهور', duration: { months: 6 } },
  { label: 'السنة الماضية', duration: { years: 1 } }
]

const selected = defineModel({
  type: Object as PropType<Range>,
  required: true
})

function isRangeSelected (duration: Duration) {
  return isSameDay(selected.value.start, sub(new Date(), duration)) && isSameDay(selected.value.end, new Date())
}

function selectRange (duration: Duration) {
  selected.value = { start: sub(new Date(), duration), end: new Date() }
}
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-end' }">
    <template #default="{ open }">
      <UButton color="gray" variant="ghost" :class="[open && 'bg-gray-50 dark:bg-gray-800']" trailing-icon="i-heroicons-chevron-down-20-solid">
        {{ format(selected.start, 'yyy/MM/dd') }} - {{ format(selected.end, 'yyy/MM/dd') }}
      </UButton>
    </template>

    <template #panel="{ close }">
      <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
        <div class="hidden sm:flex flex-col py-4">
          <UButton
            v-for="(range, index) in ranges"
            :key="index"
            :label="range.label"
            color="gray"
            variant="ghost"
            class="rounded-none px-6"
            :class="[isRangeSelected(range.duration) ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50']"
            truncate
            @click="selectRange(range.duration)"
          />
        </div>

        <DatePicker v-model="selected" @close="close" />
      </div>
    </template>
  </UPopover>
</template>
