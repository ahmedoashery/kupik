<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import type { z } from 'zod'
import { ItemSchema } from '~/schemas'
import type { Item } from '~/types'

const props = defineProps({
  item: { type: Object as PropType<Item>, default: {} as Item }
})

const emit = defineEmits(['update:item', 'close'])

const form = ref()
const state = reactive<Item>({ ...props.item })
const initialData = props.item

// Categories data
const { data: categories, refresh: refreshCategories } = await useFetch<any>('/api/items/categories')
state.category = props.item.id ? props.item.category || undefined : categories.value[0]

// Inventories data
const { data: inventories, refresh: refreshInventories } = await useFetch<any>('/api/items/inventories')
state.inventory = props.item.id ? props.item.inventory || undefined : inventories.value[0]

// Max Item Code
const { data: maxItemCode } = await useFetch<number>('/api/items/maxitemcode')
state.code = (props.item.id ? props.item.code?.toString() : maxItemCode.value?.toString()) as string

state.isActive = props.item.id ? props.item.isActive : true

// Errors Notifaications
const toast = useToast()
// Errors Notification
const onError = (error: any) => {
  // begin updating
  const errors: any[] = error?.data?.data

  if (errors && errors.length) {
    form.value.setErrors(errors?.map((err: FormError) => ({
      message: err.message,
      path: err.path[0]
    })))

    toast.add({
      id: 'Error-Notifaications',
      icon: 'i-heroicons-x-circle-20-solid',
      timeout: 1500,
      color: 'red',
      title: '',
      description: error?.data.message ?? error?.message ?? error
    })
  }
}

// Success Notification
const onSuccess = (title?: string, message?: string) => {
  toast.add({
    id: 'Success-Changes-Notifaications',
    icon: 'i-heroicons-check-circle-20-solid',
    color: 'green',
    timeout: 1500,
    title: title || '',
    description: message || 'تم الحفظ'
  })
}

// Validation Schema -- ZodType
type Schema = z.output<typeof ItemSchema>

await ItemSchema.safeParseAsync(state)

// Submit Form
async function onSubmit(event: FormSubmitEvent<Schema>) {
  form.value.clear() // clear form errors
  // if action is add
  if (!props.item.id) {
    await $fetch('/api/items/add', {
      method: 'POST',
      body: event.data,

    }).then((result) => {
      emit('update:item', result)
      onSuccess('', 'تم الحفظ')
      emit('close')

    }).catch(onError) // catch any errors
  }

  // if action is update
  else {
    // check id data changed
    const updated = JSON.stringify(state) !== JSON.stringify(initialData) // check if item updated
    // submit changes/updates
    if (!updated) {
      toast.add({
        id: 'No-Changes-Notifaications',
        title: '',
        icon: 'i-heroicons-question-mark-circle-20-solid',
        timeout: 1500,
        description: 'لا توجد تغييرات !',
        color: 'yellow'
      })
      return
    }
    await $fetch('/api/items/update/', {
      method: 'PUT',
      body: event.data,
      query: { id: props.item.id }

    }).then((result) => {
      emit('update:item', result)
      onSuccess('', 'تم الحفظ')
      emit('close')

    }).catch(onError) // catch any errors
  }

}

const invetoriesList = computed({
  get: () => state.inventory,
  set: async (inventory: any) => {
    const index = inventories.value.findIndex((i: any) => i.id == inventory.id)
    if (index !== -1) {
      state.inventory = inventory
    } else {
      // check if no inventories exist in db
      if(state.inventory === undefined || !inventory['name']) inventory = {name: inventory}
      // make an API call to create the inventory
      const newInventory = await $fetch('/api/items/inventory-add', { method: 'POST', body: inventory })
      .catch((error) => {
        alert('خطأ فى اضافة مخزن جديد ...!\n' + error.data.message)
      })
      refreshInventories()
      state.inventory = newInventory
    }
  }
})
const categoriesList = computed({
  get: () => state.category,
  set: async (category: any) => {
    const index = categories.value.findIndex((i: any) => i.id == category.id)
    if (index !== -1) {
      state.category = category
    } else {
      // check if no inventories exist in db
      if(state.inventory === undefined || !category['name']) category = {name: category}
      // make an API call to create the inventory
      const newCategory = await $fetch('/api/items/category-add', { method: 'POST', body: category })
      .catch((error) => {
          alert('خطأ فى اضافة تصنيف جديد ...!\n' + error.data.message)
        console.log(error.data)
      })
      refreshCategories()
      state.category = newCategory
    }
  }
})

</script>

<template>
  <UForm ref="form" :state="state" class="space-y-4 cursor-pointer" @submit="onSubmit">
    <UFormGroup label="كود" name="code" class="">
      <UInput v-model="(state.code as string)" placeholder="كود الصنف" disabled />
    </UFormGroup>
    <UFormGroup label="الاسم" name="name" required>
      <UInput v-model.trim="state.name" placeholder="اسم الصنف" :model-modifiers="{ trim: true }" autofocus />
    </UFormGroup>

    <UFormGroup label="مخزن" name="inventory" required>
      <USelectMenu
        v-model="invetoriesList"
        by="id"
        :options="inventories"
        option-attribute="name"
        placeholder="تحديد مخزن"
        searchable
        searchable-placeholder="بحث..."
        clear-search-on-close
        creatable
      >
        <template #option-create="{ option }">
          <span class="flex-shrink-0">اضافة: </span>
          <span class="mx-1 block truncate">{{ option.name }}</span>
        </template>
      </USelectMenu>
    </UFormGroup>
    <UFormGroup label="تصنيف" name="category" required>
      <USelectMenu
        v-model="categoriesList"
        by="id"
        :options="categories"
        option-attribute="name"
        placeholder="تحديد تصنيف"
        searchable
        searchable-placeholder="بحث..."
        clear-search-on-close
        creatable
      >
        <template #option-create="{ option }">
          <span class="flex-shrink-0">اضافة: </span>
          <span class="mx-1 block truncate">{{ option.name }}</span>
        </template>
      </USelectMenu>
    </UFormGroup>
    <UFormGroup label="سعر الشراء" name="cost">
      <UInput v-model="state.cost" placeholder="سعر الشراء" />
    </UFormGroup>
    <UFormGroup label="سعر البيع" name="price">
      <UInput v-model="state.price" placeholder="سعر البيع" />
    </UFormGroup>
    <UFormGroup label="نشط/معلق" name="isActive">
      <UCheckbox v-model="state.isActive" />
    </UFormGroup>


    <div class="flex justify-end gap-3">
      <UButton label="الغاء" color="gray" variant="soft" @click="emit('close')" />
      <UButton type="submit" label="موافق" color="primary" variant="soft" />
    </div>
  </UForm>
</template>
