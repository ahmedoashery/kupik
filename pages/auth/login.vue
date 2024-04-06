<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { type InferType } from 'yup'
import { AuthSchema } from '~/schemas'
import type { FormError } from '#ui/types'

const { signIn } = useAuth()

definePageMeta({
  layout: 'auth',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  }
})

useSeoMeta({
  title: 'Login'
})

const loading = ref(false)
const errorMessage = ref<any>('')
const errors = ref<FormError[]>([])
const toast = useToast()

type Schema = InferType<typeof AuthSchema>

const fields = [
  {
    name: 'username',
    type: 'text',
    label: 'اسم المستخدم',
    placeholder: 'اسم اسمتخدم'
  },
  {
    name: 'password',
    label: 'كلمة المرور',
    type: 'password',
    placeholder: 'كلمة المرور'
  }
]

const onError = (err: any) => {
  errorMessage.value = err?.data?.message! ?? err?.message! ?? err!

  // add error notification
  // toast.add({
  //   id: 'authorization-errors',
  //   color: 'red',
  //   title: '',
  //   description: err?.data?.message! ?? err?.message! ?? err!
  // })
}

const onSubmit = async (data: FormSubmitEvent<Schema>) => {
  loading.value = true
  await signIn(data, { callbackUrl: '/' }).catch(onError)
  loading.value = false
}
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="fields"
      :schema="AuthSchema"
      title="دخول المستخدمين"
      :align="'top'"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ label: 'الاستمرار', trailingIcon: 'i-heroicons-arrow-right-20-solid' }"
      :loading="loading"
      @submit="onSubmit"
    >
      <template #description>
        حساب جديد؟
        <NuxtLink to="/auth/signup" class="text-primary font-medium">
          تسجيل
        </NuxtLink>
      </template>

      <template #password-hint>
        <NuxtLink to="/" class="text-primary font-medium">
          نسيت كلمة المرور؟
        </NuxtLink>
      </template>

      <template #validation>
        <div>
          <UAlert
            v-if="errorMessage"
            variant="subtle"
            color="red"
            icon="i-heroicons-information-circle-20-solid"
            title=""
            :description="errorMessage"
          />
        </div>
      </template>

      <template #footer>
        بتسجيل الدخول توافق على <NuxtLink to="/" class="text-primary font-medium">
          شروط الخدمة
        </NuxtLink>.
      </template>
    </UAuthForm>
  </UCard>
</template>
