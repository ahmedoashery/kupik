<script setup lang="ts">
import { ref } from 'vue'

import { debounce } from '@vexip-ui/utils'
import { arEGLocale } from 'vexip-ui'

interface Option {
  fullname: string,
  id: number
}

const data: any = await $fetch('/api/entity/customers-list')
const value = ref<number>()
const options = ref<Option[]>(data)

let timer: ReturnType<typeof setTimeout>

const queryFilter = debounce((input: string) => {
  clearTimeout(timer)
  options.value = input ? data.filter((entity: {id: number, fullname: string}) =>entity.fullname.toLowerCase().startsWith(input)) : []
})

</script>

<template>
  <VSelect
    v-model:value="value"
    clearable
    remote
    filter
    :options="options"
    :key-config="{label: 'fullname', value: 'id'}"
    fit-popper
    placeholder="تحديد عميل"
    :max-list-height="100"
    @filter-input="queryFilter"
  />
  <br>
</template>

<style scoped>
.vxp-select {
  max-width: 400px;
}
</style>
