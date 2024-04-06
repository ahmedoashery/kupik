<template>
  <div ref="infiniteScroller" class="w-full h-full overflow-auto">
    <slot />

    <div ref="infiniteTrigger" class="w-full h-auto text-center">
      <UButton v-if="!completed" loading trailing variant="link" label="جار التحميل..." />
      <!-- <UButton v-else icon="i-heroicons-circle-stack" color="red" variant="link" label="لا توجد بيانات اخرى!" /> -->
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps({
  completed: {type: Boolean, default: false}
})

const infiniteScroller = ref()
const infiniteTrigger = ref()

const emit = defineEmits(['onInfiniteScroll'])

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      const trigger = entries[0]
      if (trigger.isIntersecting) { emit('onInfiniteScroll') }
    },
    {
      root: infiniteScroller.value,
      rootMargin: '200px',
      threshold: 0
    }
  )
  // start observer
  observer.observe(infiniteTrigger.value)
})
</script>
