<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { z } from 'zod'
import type { Entity } from '~/types'

const props = defineProps({
  entity: {
    type: Object as PropType<Entity>,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

const form = ref()
const state = computed(() => props.entity)
const initialData = props.entity
const group = ref()

const toast = useToast()
const onError = (error: any) => {
  const errors = error.data.data
  form.value.setErrors(errors.map((err: FormError) => ({
    message: err.message,
    path: err.path[0]
  })))

  // toast.add({
  //   color: 'red',
  //   title: 'خطأ فى التسجيل',
  //   description: error?.data.message ?? error?.message ?? error
  // })
}
const onSuccess = (title?: string, message?: string) => {
  toast.add({
    color: 'green',
    title: title || 'تحديث بيانات',
    description: message || 'تم الحفظ'
  })
}

const schema = z.object({
  firstname: z.string().min(1, 'يجب ادخال الاسم الاول').trim(),
  lastname: z.string().trim(),
})
type Schema = z.output<typeof schema>

// await schema.safeParseAsync(state)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  form.value.clear() // clear form errors

  const updated = JSON.stringify(state) !== JSON.stringify(initialData) // check if entity updated

  if (updated) {
    await $fetch(`/api/entities/${props.entity?.id}`, {
      method: 'POST',
      body: event.data,
      params: { group: group.value }

    }).then(() => {
      onSuccess('تحديث بيانات', 'تم الحفظ')

    }).catch(onError)

  }
}
</script>

<template>
  <UDashboardPanelContent>
    <div class="flex justify-between">
      <div class="flex items-center gap-4">
        <UAvatar :src="entity.avatar" :alt="entity.fullname" size="lg" />

        <div class="min-w-0">
          <p class="text-gray-900 dark:text-white font-semibold">
            {{ entity.fullname }}
          </p>
        </div>
      </div>
    </div>
    <UDivider class="my-5" />

    <form @submit.prevent>
      <UTextarea color="gray" required size="xl" :rows="5" :placeholder="`Reply to ${entity.fullname}`">
        <UButton type="submit" color="black" label="Send" icon="i-heroicons-paper-airplane" class="absolute bottom-2.5 right-3.5" />
      </UTextarea>
    </form>
    <UForm ref="form" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="الاسم" name="firstname">
        <UInput v-model="state.firstname" placeholder="الاسم الاول" autofocus />
      </UFormGroup>

      <UFormGroup label="الاسم الاخير" name="lastname">
        <UInput v-model="state.lastname" placeholder="الاسم الاخير" />
      </UFormGroup>

      <div class="flex justify-end gap-3">
        <UButton label="الغاء" color="gray" variant="soft" @click="console.log('cancel')" />
        <UButton type="submit" label="موافق" color="primary" variant="soft" />
      </div>
    </UForm>
  </UDashboardPanelContent>
</template>
