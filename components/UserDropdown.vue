<script setup lang="ts">
const { isHelpSlideoverOpen } = useDashboard()
const { isDashboardSearchModalOpen } = useUIState()
const { metaSymbol } = useShortcuts()
const { data, signOut } = useAuth()

const items = computed(() => [
  [{
    slot: 'account',
    label: '',
    disabled: true
  }], [{
    label: 'اعدادات البرنامج',
    icon: 'i-heroicons-cog-8-tooth',
    to: '/settings'
  }, {
    label: 'قائمة البحث',
    icon: 'i-heroicons-command-line',
    shortcuts: [metaSymbol.value, 'K'],
    click: () => {
      isDashboardSearchModalOpen.value = true
    }
  }, {
    label: 'الدعم & المساعدة',
    icon: 'i-heroicons-question-mark-circle',
    shortcuts: ['?'],
    click: () => isHelpSlideoverOpen.value = true
  }], [{
    label: 'شرح البرنامج',
    icon: 'i-heroicons-book-open',
    to: 'https://facebook.com/ahmedoashery',
    target: '_blank'
  }, {
    label: 'تواصل فيس بوك',
    icon: 'i-simple-icons-github',
    to: 'https://facebook.com/ahmedoashery',
    target: '_blank'
  }, {
    label: 'طلب شراء',
    icon: 'i-heroicons-credit-card',
    to: 'https://facebook.com/ahmedoashery',
    target: '_blank'
  }], [{
    label: 'تسجيل خروج',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: async () => await signOut({ callbackUrl: '/auth/login' })
  }]
])
</script>

<template>
  <UDropdown
    mode="click"
    :items="items"
    :ui="{ width: 'w-full', item: { disabled: 'cursor-text select-text' } }"
    :popper="{ strategy: 'absolute', placement: 'top' }"
    class="w-full"
  >
    <template #default="{ open }">
      <UButton
        color="gray"
        variant="ghost"
        class="w-full"
        :label="data?.fullname!"
        :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      >
        <template #leading>
          <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" size="2xs" />
        </template>

        <template #trailing>
          <UIcon name="i-heroicons-ellipsis-vertical" class="w-5 h-5 ml-auto" />
        </template>
      </UButton>
    </template>

    <template #account>
      <div class="text-start">
        <p>
          مستخدم:
        </p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ data?.name! }}
        </p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ data?.email! }}
        </p>
      </div>
    </template>
  </UDropdown>
</template>
