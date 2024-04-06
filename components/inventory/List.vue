<template>
  <UFormGroup label="مخزن" :name="name" required>
    <USelectMenu
      v-model="state"
      by="id"
      :options="items"
      :option-attribute="name"
      :placeholder="`تحديد ${label}`"
      searchable
      searchable-placeholder="بحث..."
      clear-search-on-close
      @update:model-value="emit('update:modelValue')"
    />
  </UFormGroup>
</template>

<script setup lang='ts'>

const props = defineProps({
    list: { type: String, default: '' },
    selected: { type: Object, default: {} || undefined  },
    name: { type: String, default: '' },
    label: { type: String, default: '' },
    required: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue'])

// Inventories data
const { data: items } = await useFetch<any>(`/api/${props.list}`)
const state = ref((props.selected?.id! ? props.selected : undefined) || items?.value[0]! || undefined)

</script>

<style></style>
