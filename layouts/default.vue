<script setup lang="ts">
import { arEGLocale } from 'vexip-ui'

const route = useRoute()
const appConfig = useAppConfig()
const { isHelpSlideoverOpen } = useDashboard()

const links = [{
  id: 'home',
  label: 'صفحة رئيسية',
  icon: 'i-heroicons-home',
  to: '/',
  tooltip: {
    text: 'لوحة المعلومات',
    shortcuts: ['G', 'H']
  }
}, {
  id: 'pos',
  label: 'نقطة بيع',
  icon: 'i-heroicons-inbox',
  to: '/pos',
  badge: '',
  tooltip: {
    text: 'نقاط البيع السريع',
    shortcuts: ['G', 'I']
  }
},
{
  id: 'entity',
  label: 'عملاء وموردين',
  icon: 'i-heroicons-user-group',
  to: '/entities',
  tooltip: {
    text: 'ادارة العملاء والموردين',
    shortcuts: ['G', 'U']
  }
},
{
  id: 'inventory',
  label: 'الاصناف والمخازن',
  icon: 'i-heroicons-user-group',
  to: '/inventory',
  tooltip: {
    text: 'ادارة الاصناف والمخازن وتصنيفات الاصناف',
    shortcuts: ['G', 'U']
  }
},
{
  id: 'accounting',
  label: 'الحسابات العامة',
  icon: 'i-heroicons-user-group',
  to: '/accounting',
  tooltip: {
    text: 'ادارة الحسابات العامة',
    shortcuts: ['G', 'U']
  }
},
{
  id: 'users',
  label: 'المستخدمين',
  icon: 'i-heroicons-user-group',
  to: '/users',
  tooltip: {
    text: 'اعدادات المستخدمين والصلاحيات',
    shortcuts: ['G', 'U']
  }
},
{
  id: 'settings',
  label: 'الاعدادات',
  to: '/settings',
  icon: 'i-heroicons-cog-8-tooth',
  children: [{
    label: 'عام',
    to: '/settings',
    exact: true
  }, {
    label: 'الحسابات',
    to: '/settings/members'
  }, {
    label: 'الاشعارات',
    to: '/settings/notifications'
  }],
  tooltip: {
    text: 'اعدادات النظام',
    shortcuts: ['G', 'S']
  }
},
{
  id:'reports',
  label: 'مركز التقارير',
  to:'/reports',
  icon:'i-heroicons-table-cells'
}
]

const footerLinks = [{
  label: 'شرح البرنامج',
  icon: 'i-heroicons-plus',
  to: '/settings/members'
}, {
  label: 'الدعم والمساعدة!',
  icon: 'i-heroicons-question-mark-circle',
  click: () => isHelpSlideoverOpen.value = true
}]

const groups = [{
  key: 'links',
  label: 'Go to',
  commands: links.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts }))
}, {
  key: 'code',
  label: 'Code',
  commands: [{
    id: 'source',
    label: 'View page source',
    icon: 'i-simple-icons-github',
    click: () => {
      window.open(`https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${route.path === '/' ? '/index' : route.path}.vue`, '_blank')
    }
  }]
}]

const defaultColors = ref(['green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet'].map(color => ({ label: color, chip: color, click: () => appConfig.ui.primary = color })))
const colors = computed(() => defaultColors.value.map(color => ({ ...color, active: appConfig.ui.primary === color.label })))
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <!-- ~/components/UserDropdown.vue -->
          <UserDropdown />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton />
        </template>

        <UDashboardSidebarLinks :links="links" />

        <UDivider />

        <UDashboardSidebarLinks :links="[{ label: 'Colors', draggable: true, children: colors }]" @update:links="colors => defaultColors = colors" />

        <div class="flex-1" />

        <UDashboardSidebarLinks :links="footerLinks" />

        <UDivider class="sticky bottom-0" />

        <template #footer>
          <!-- ~/components/TeamsDropdown.vue -->
          <TeamsDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>
    <VConfigProvider :locale="arEGLocale()">
      <slot />
    </VConfigProvider>

    <!-- ~/components/HelpSlideover.vue -->
    <HelpSlideover />
    <!-- ~/components/NotificationsSlideover.vue -->
    <NotificationsSlideover />

    <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly>
  </UDashboardLayout>
</template>
