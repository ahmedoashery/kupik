<script setup lang="ts">
import type { Entity } from '~/types'

const props = defineProps({
  modelValue: {
    type: Object as PropType<Entity | null>,
    default: null
  },
  entities: {
    type: Array as PropType<Entity[]>,
    default: () => []
  },
  group: { type: String, default: 'Customers' },
})

const emit = defineEmits(['update:modelValue', 'update:group'])

const items = ref(props.entities)
const search = ref('')
const isActive = ref(true)
const page = ref<number>(0)
const cursor = ref<number>(0)
const count = ref<number>(0)
const completed = ref(false)
const entitiesRefs = ref<Element[]>([])

const selectedEntity = computed({
  get() {
    return props.modelValue
  },
  set(value: Entity | null) {
    emit('update:modelValue', value)
  }
})

const selectedGroup = computed({
  get(){return props.group},
  set(value: any){
    emit('update:group', value)
  }
})

watch(selectedEntity, () => {
  if (!selectedEntity.value) { return }

  const ref = entitiesRefs.value[selectedEntity.value.id]
  if (ref) {
    ref.scrollIntoView({ block: 'nearest' })
  }
})

watch(selectedGroup, async () =>{
  page.value = 0
  cursor.value = 0
  items.value = []
  await load()
})
watch(search, async () =>{
  page.value = 0
  cursor.value = 0
  items.value = []
  await load()
})

// Reset selected entity if it's not in the filtered entities
watch(items, () => {
  if (!items.value.find((entity:any )=> entity.id === selectedEntity.value?.id)) {
    selectedEntity.value = null
  }
})

defineShortcuts({
  arrowdown: () => {
    const index = props.entities.findIndex((entity) => entity.id === selectedEntity.value?.id)

    if (index === -1) {
      selectedEntity.value = props.entities[0]
    } else if (index < props.entities.length - 1) {
      selectedEntity.value = props.entities[index + 1]
    }
  },
  arrowup: () => {
    const index = props.entities.findIndex((entity) => entity.id === selectedEntity.value?.id)

    if (index === -1) {
      selectedEntity.value = props.entities[props.entities.length - 1]
    } else if (index > 0) {
      selectedEntity.value = props.entities[index - 1]
    }
  }
})

const load = async () => {
  page.value++
  const data: any = await $fetch('/api/entity', {
    params: {
      group: selectedGroup.value,
      isActive: isActive.value,
      page: page.value,
      cursor: cursor.value,
      q: search.value,
    }
  })

  // add more data if availavle or stop
  if (data.rows.length === 0) { completed.value = true }
  else {
    count.value = data?.count
    cursor.value = data?.cursor as number
    items.value = [...items.value, ...data.rows]
  }

}
const resetFilters = () => {
  search.value = ''
}
</script>

<template>
  <UInput
    v-model.trim="search"
    size="xs"
    icon="i-heroicons-magnifying-glass-20-solid"
    placeholder="بحث"
    autofocus
    class="w-full"
    :ui="{ icon: { trailing: { pointer: '' } } }"
  >
    <template #trailing>
      <UButton
        v-show="search !== ''"
        color="gray"
        variant="link"
        icon="i-heroicons-x-mark-20-solid"
        :padded="false"
        @click="resetFilters"
      />
    </template>
  </UInput>
  <UInfiniteScroller :completed="completed" @on-infinite-scroll="load">
    <div v-for="(entity, index) in items" :key="index" :ref="el => { entitiesRefs[entity.id] = el as Element }">
      <div
        class="p-4 text-sm cursor-pointer border-l-2"
        :class="[
          selectedEntity && selectedEntity.id === entity.id ? 'border-primary-500 dark:border-primary-400 bg-primary-100 dark:bg-primary-900/25' : 'border-white dark:border-gray-900 hover:border-primary-500/25 dark:hover:border-primary-400/25 hover:bg-primary-100/50 dark:hover:bg-primary-900/10'
        ]"
        @click="selectedEntity = entity"
      >
        <div class="flex items-center justify-start gap-2">
          <UChip v-if="entity.isActive" />
          <div class="flex items-center gap-3">
            {{ entity.id }} - {{ entity.fullname }}
          </div>
        </div>
      </div>

      <UDivider />
    </div>
  </UInfiniteScroller>
</template>
