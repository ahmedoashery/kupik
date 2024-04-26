<template>
  <UInputMenu
    v-model="selected"
    v-model:query="query"
    :options="entities.rows"
    searchable
    :loading="loading"
    placeholder="اختيار..."
    :popper="{ placement: 'bottom-start' }"
    by="id"
    option-attribute="fullname"
    trailing
  >
    <template #option-empty="{ query }">
      <span>لم يتم العثور على "{{ query }}"</span>
      <UButton label="اضافة" variant="link" color="primary" />
    </template>
    <template #empty>
      <span>لا توجد بيانات !</span>
    </template>
  </UInputMenu>
</template>

<script setup lang='ts'>
const entity = ref()
const query = ref('')
const entities = await useFetch('/api/entity', {query: { q: query.value, isActive: true, group: 'Customers' },})
const selected = computed({
  get: () => entity.value,
  set: async (entity) => {
    const index = entities.value.rows.findIndex((e: any) => e.id == entity.id)
    if (index !== -1) { entity.value = entity }
    else {
      const entities: any = await $fetch('/api/entity', {
        query: { q: query.value, isActive: true, group: 'Customers' },
      })
      entities.value = entities.rows
      return entities.rows
    }
  }
})
const loading = ref(false)
const search = async (query: string) => {
  const entities: any = await $fetch('/api/entity', {
    query: { q: query, isActive: true, group: 'Customers' },
  })
  entities.value = entities.rows
  return entities.rows
}
</script>

<style></style>
