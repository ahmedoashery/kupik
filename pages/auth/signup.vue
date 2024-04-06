<script setup lang="ts">
import { UserSchema } from '~/schemas'

const { signUp } = useAuth()

definePageMeta({
  layout: 'auth',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  }
})

useSeoMeta({
  title: 'Sign up'
})

const loading = ref(false)
const errorMessage = ref<any>('')
const toast = useToast()

const fields = [
  {
    name: 'firstname',
    type: 'text',
    label: 'الاسم الاول',
    placeholder: 'الاسم الاول'
  },
  {
    name: 'lastname',
    type: 'text',
    label: 'الاسم الاخير',
    placeholder: 'الاسم الاخير'
  },
  {
    name: 'email',
    type: 'text',
    label: 'Email',
    placeholder: 'بريد الكترونى'
  },
  {
    name: 'password',
    label: 'كلمة المرور',
    type: 'password',
    placeholder: 'كلمة المرور'
  },
  // {
  //   name: 'contact',
  //   label: 'Contact',
  //   type: 'text',
  //   placeholder: 'Enter your contact'
  // },
  // {
  //   name: 'phone',
  //   label: 'Phone',
  //   type: 'phone',
  //   placeholder: 'Enter your phone'
  // },
  // {
  //   name: 'company',
  //   label: 'Company',
  //   type: 'text',
  //   placeholder: 'Enter your company'
  // },
  // {
  //   name: 'address',
  //   label: 'Address',
  //   type: 'address',
  //   placeholder: 'Enter your address'
  // },
  // {
  //   name: 'city',
  //   label: 'City',
  //   type: 'text',
  //   placeholder: 'Enter your city'
  // },
  // {
  //   name: 'zipcode',
  //   label: 'Zipcode',
  //   type: 'number',
  //   placeholder: 'Enter your zipcode'
  // },
  // {
  //   name: 'image',
  //   label: 'Image',
  //   type: 'text',
  //   placeholder: 'Enter your image'
  // }
]

const onError = (err: any) => {
  errorMessage.value = err?.data?.message! ?? err?.message! ?? err!

  // toast.add({
  //   id: 'register-user-errors',
  //   color: 'red',
  //   title: '',
  //   description: err?.data.message ?? err?.message ?? err
  // })
}

async function onSubmit(data: any) {
  loading.value = true
  await signUp(data, { callbackUrl: '/auth/login' }).catch(onError)
  loading.value = false
}
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard class="max-w-lg w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :loading="loading"
      :fields="fields"
      :schema="UserSchema"
      title="تسجيل حساب جديد"
      :submit-button="{ label: 'تسجيل' }"
      @submit="onSubmit"
    >
      <template #description>
        لديك حساب بالفعل؟ <NuxtLink to="/auth/login" class="text-primary font-medium">دخول</NuxtLink>.
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
        التسجيل يعنى الموافقة على <NuxtLink to="/" class="text-primary font-medium">شروط الخدمة!</NuxtLink>.
      </template>
    </UAuthForm>
  </UCard>
</template>
