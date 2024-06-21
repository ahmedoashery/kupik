<script lang="ts" setup>
import type { Item } from '~/types'

const defaultColumns = [{
  key: 'id',
  label: '#'
},
{
  key: 'code',
  label: 'كود',
  sortable: true
},
{
  key: 'name',
  label: 'الصنف',
  sortable: true
},
{
  key: 'category.name',
  label: 'التصنيف',
  sortable: true
},
{
  key: 'inventory.name',
  label: 'المخزن',
  sortable: true
},
{
  key: 'cost',
  label: 'سعر الشراء',
  sortable: true
},
{
  key: 'price',
  label: 'سعر البيع',
  sortable: true
},
{
  key: 'isActive',
  label: 'نشط/معلق',
  sortable: true,

}
]

const search = ref('')
const selectedItems = ref<Item[]>([])
const selectedColumns = ref(defaultColumns)
const sort = ref({ column: 'id', direction: 'asc' as const })
const input = ref<{ input: HTMLInputElement }>()
const isItemModalOpen = ref(false)

const columns = computed(() => defaultColumns.filter((column) => selectedColumns.value.includes(column)))

// Pagination
const page = ref<number>(1)
const pageCount = ref<any>(20)
const cursor = ref<string | number>() // for cursor pagination
const pageTotal = computed(() => items.value.count) // This value should be dynamic coming from the API
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

// Categories data
const { data: categories, refresh: refreshCategories } = await useFetch<any>('/api/items/categories')
const selectedCategories = ref([])

// Inventories data
const { data: inventories, refresh: refreshInventories } = await useFetch<any>('/api/items/inventories')
const selectedInventories = ref([])

// status -- active or inactive
const isActive = ref(false)

// items query
const query = computed(() => ({
  q: search.value,
  isActive: isActive.value,
  inventories: selectedInventories.value,
  categories: selectedCategories.value,
  page: page.value,
  take: pageCount.value,
  sort: sort.value.column,
  order: sort.value.direction
}))

// Items data
const { data: items, pending, refresh: refreshItems } = await useFetch<any>('/api/items',
  {
    query,
    default: () => [],
    watch: [search, isActive, page, pageCount, selectedInventories, selectedCategories, sort]
  })

// select items
function onSelect(row: Item) {
  const index = selectedItems.value.findIndex((item) => item.id === row.id)
  if (index === -1) { selectedItems.value.push(row) }
  else { selectedItems.value.splice(index, 1) }
}

defineShortcuts({
  '/': () => {
    input.value?.input?.focus()
  }
})

// watch search to reset pagination -- set page = 1
watch([search, pageCount], () => {
  // reset pagination
  page.value = 1
})


const refresh = async () => {
  await refreshItems()
  await refreshInventories()
  await refreshCategories()
  selectedItems.value = []
}
const resetFilters = () => {
  search.value = ''
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="الاصناف" :badge="items.total">
        <template #right>
          <UButton
            label="جديد"
            size="xs"
            trailing-icon="i-heroicons-plus-circle-16-solid"
            color="gray"
            @click="isItemModalOpen = true; selectedItems = []"
          />
          <UButton
            :disabled="selectedItems.length !== 1"
            label="تعديل"
            size="xs"
            trailing-icon="i-heroicons-pencil-square"
            color="gray"
            @click="isItemModalOpen = true;"
          />
          <UButton
            :disabled="selectedItems.length <= 1"
            label="تعديل متعدد"
            size="xs"
            trailing-icon="i-heroicons-pencil-square-20-solid"
            color="gray"
            @click="isItemModalOpen = true;"
          />

          <UButton
            variant="outline"
            icon="i-heroicons-arrow-path-rounded-square-solid"
            label="تحديث"
            :loading="pending"
            size="xs"
            @click="refreshItems"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <div class="flex justify-evenly gap-2">
            <!-- Inventories filter -->
            <USelectMenu
              v-model="selectedInventories"
              :options="inventories"
              by="id"
              option-attribute="name"
              name="inventories"
              size="xs"
              icon="i-heroicons-inbox-stack"
              placeholder="المخزن"
              class="lg:min-w-40"
              multiple
              :ui-menu="{ option: { base: 'capitalize' } }"
            >
              <template #label>
                مخزن
              </template>
              <template #option-empty="{ query }">
                <q>{{ query }}</q> not found
              </template>
            </USelectMenu>

            <!-- Categories filter -->
            <USelectMenu
              v-model="selectedCategories"
              :options="categories"
              by="id"
              option-attribute="name"
              name="categories"
              size="xs"
              icon="i-heroicons-clipboard-document-list"
              placeholder="التصنيف"
              class="lg:min-w-40"
              multiple
              :ui-menu="{ option: { base: 'capitalize' } }"
            >
              <template #label>
                تصنيف
              </template>
            </USelectMenu>

            <!-- isActive filter -->
            <UCheckbox
              v-model="isActive"
              name="isActive"
              class="py-1 mx-2 cursor-pointer"
              label="عرض غير نشط"
              color="red"
              :ui="{ label: 'text-red-700' }"
            />
            <!-- <URadioGroup v-model="isActive" :options="[{value: -1, label: 'الكل'},{value: 1, label: 'نشط'},{value: 0, label: 'غير نشط'},]" /> -->
          </div>
        </template>

        <template #right>
          <USelectMenu
            v-model="selectedColumns"
            size="xs"
            icon="i-heroicons-view-columns"
            :options="defaultColumns"
            multiple
            class="lg:min-w-40"
          >
            <template #label>
              الاعمدة
            </template>
          </USelectMenu>
        </template>
      </UDashboardToolbar>

      <UDashboardModal
        v-model="isItemModalOpen"
        title="صنف جديد"
        description="اضافة صنف جديد لقاعدة البيانات"
        :ui="{ width: 'sm:max-w-md' }"
      >
        <!-- ~/components/inventory/ItemForm.vue -->
        <ItemForm
          v-if="selectedItems.length <= 1"
          :item="selectedItems[0]"
          @update:item="refresh"
          @close="isItemModalOpen = false"
        />
        <MultippleItemsForm v-else :item="selectedItems" @close="isItemModalOpen = false" />
      </UDashboardModal>

      <!-- Search -->
      <div class="flex justify-between p-2 gap-0">
        <USelect v-model="pageCount" size="sm" :options="[10, 20, 50, 75, 100]" class="text-center">
          <template #label>
            عرض
          </template>
        </USelect>

        <UInput
          ref="input"
          v-model.trim="search"
          size="sm"
          icon="i-heroicons-funnel"
          autocomplete="off"
          autofocus
          :loading="pending"
          placeholder="بحث (كود - صنف - تصنيف - مخزن)"
          class="w-full max-w-lg mx-4"
          :ui="{ icon: { trailing: { pointer: '' } } }"
          @keydown.esc="$event.target.blur()"
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
      </div>

      <UTable
        v-model="selectedItems"
        v-model:sort="sort"
        :rows="items.rows"
        :columns="columns"
        :loading="pending"
        :loading-state="{ icon: 'i-heroicons-arrow-path-solid', label: 'جار التحميل...' }"
        :progress="{ color: 'red', animation: 'carousel' }"
        :empty-state="{ icon: 'i-heroicons-circle-stack', label: 'لا توجد بيانات' }"
        sort-mode="manual"
        class="mx-2"
        :ui="{
          wrapper: 'border dark:border-gray-700 rounded',
          divide: 'divide-gray-200 dark:divide-gray-800',
          thead: 'bg-gray-200 dark:bg-gray-700',
          th: { base: 'text-start', padding: 'py-1.5' },
          td: { base: 'whitespace-nowrap', padding: 'py-1.5 px-4' },
        }"
        @select="onSelect"
      >
        <template #name-data="{ row }">
          <div class="flex items-center gap-3">
            <!-- <UAvatar v-bind="row.avatar" :alt="row.name" size="xs" /> -->
            <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
          </div>
        </template>

        <template #isActive-data="{ row }">
          <UBadge
            :color="row.isActive ? 'green' : 'red'"
            variant="subtle"
            class=""
            :label="row.isActive ? 'نشط' : 'معلق'"
          />
        </template>

        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <UIcon name="i-heroicons-circle-stack" />
            <h5>لا توجد بيانات</h5>
            <UDivider />
            <UButton v-show="items.total === 0" label="اضافة جديد" icon="i-heroicons-plus-circle" @click="isItemModalOpen = true; selectedItems = []" />
          </div>
        </template>
      </UTable>

      <!-- pagination -->
      <div class="flex flex-wrap justify-between items-center p-3 my-0">
        <div class="my-2">
          <span class="text-sm leading-5">
            عرض
            <span class="font-medium und">{{ pageFrom as number }}</span>
            الى
            <span class="font-medium">{{ pageTo as number }}</span>
            من
            <span class="font-medium">{{ pageTotal as number }}</span>
            سجل
          </span>
        </div>
        <UPagination
          v-model="page"
          :page-count="(parseInt(pageCount))"
          :max="5"
          :total="(parseInt(pageTotal))"
          :ui="{
            wrapper: 'flex items-center gap-1',
            rounded: '!rounded-full min-w-[32px] justify-center',
            default: {
              activeButton: {
                variant: 'outline'
              }
            }
          }"
        />
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
