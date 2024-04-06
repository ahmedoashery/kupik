<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="الفرع: " class="bg-gray-50 dark:bg-gray-700" />

      <UDashboardToolbar class="bg-white dark:bg-gray-600">
        <template #left>
          <div>
            <!-- customer -->
            <UFormGroup label="العميل:">
              <UInputMenu
                ref="customersList"
                v-model="selectedCustomer"
                v-model:query="searchCustomerQuery"
                :search="searchCustomer"
                :loading="loadingCustomers"
                placeholder="اختيار عميل..."
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
            </UFormGroup>
          </div>
        </template>
        <template #right>
          <div class="grid">
            <!-- user -->
            <div>المستخدم: {{ user?.name! || 'ضيف' }}</div>
            <div>
              <!-- date -->
              التاريخ: {{ invoiceDate.toLocaleDateString("ar-EG") }}
            </div>
          </div>
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <!-- <div class="grid justify-between h-full w-full p-3"> -->
        <UTable
          ref="itemsTable"
          :rows="invoiceItems"
          :columns="invoiceItemsColumns"
          class="bg-white w-full dark:bg-gray-900 h-96"
        >
          <template #no-data="{ row, index }">
            <span v-if="row.item" clss="text-center">{{ index + 1 }}</span>
          </template>

          <template #item-data="{ row, index }">
            <UInputMenu
              ref="itemsList"
              v-model="row.item"
              nullable
              :search="searchItem"
              placeholder=""
              :popper="{ placement: 'bottom-start' }"
              by="id"
              option-attribute="name"
              variant="none"
              trailing
              trailing-icon=""
              @change="() => updateInvoiceItemsLines(row, index)"
            >
              <template #option-empty="{ query }">
                <span>"{{ query }} - غير متاح"</span>
                <UButton label="اضافة ؟" variant="link" color="primary" @click="(e: any) => console.log(e)" />
              </template>
              <template #empty>
                <span>لا توجد بيانات !</span>
              </template>
            </UInputMenu>
          </template>

          <template #quantity-data="{ row }">
            <UInput
              v-model.number="row.quantity"
              type="number"
              variant="none"
              :min="1"
              @change="row.quantity === 0 ? (row.quantity = 1) : row.quantity"
            />
          </template>

          <template #price-data="{ row }">
            <UInput
              v-model.number="row.price"
              type="number"
              variant="none"
              min="1"
              @change="row.price === 0 ? (row.price = 1) : row.price"
            />
          </template>

          <template #amount-data="{ row }">
            <span v-if="row.quantity && row.price" clss="text-center">{{ Number(row.quantity *
              row.price).toLocaleString() }}</span>
          </template>
          <template #actions-data="{ row, index }">
            <UButton
              v-if="row.quantity && row.price"
              icon="i-heroicons-archive-box-x-mark-16-solid"
              color="red"
              size="xs"
              variant="link"
              @click="removeItem(index)"
            />
          </template>

          <template #empty-state>
            <div class="flex flex-col items-center justify-center mt-36 gap-3">
              <span class="italic text-sm">!لا توجد بيانات</span>
            </div>
          </template>
        </UTable>

        <!-- <div class="grid w-full p-2 bg-white dark:bg-gray-600 rounded-md"> -->
        <div class="flex justify-between rounded-md my-2 px-2">
          <div>
            <div>عدد الاصناف = {{ count }}</div>
            <div>
              الاجمالى الفرعى = {{ subTotal.toLocaleString('ar-EG', {
                style: 'currency', currency: 'EGP',
                maximumFractionDigits: 2, useGrouping: true, compactDisplay: 'short'
              }) }}
            </div>
            <div>
              نسبةالخصم % = {{ isNaN(totalDiscountPercentage) ? 0 : totalDiscountPercentage.toFixed(2) }} %
            </div>
            <div>
              الاجمالى = {{ total.toLocaleString('ar-EG', {
                style: 'currency', currency: 'EGP',
                maximumFractionDigits: 2,
                useGrouping: true, compactDisplay: 'short'
              }) }}
            </div>
          </div>
          <div calss="justify-start">
            <UFormGroup
              label="خصم ="
              class="w-auto"
              name="totalDiscount"
              :ui="{ wrapper: 'flex', label: { wrapper: 'w-20 h-full' } }"
            >
              <UInput
                v-model.number="totalDiscount"
                type="number"
                min="0.0"
                :max="subTotal"
                color="gray"
                :disabled="subTotal <= 0"
                @change="recalculate"
              />
            </UFormGroup>
            <UFormGroup
              label="مدفوع ="
              class="w-auto"
              :ui="{ inner: 'bg-red', wrapper: 'flex', label: { wrapper: 'w-20 h-full' } }"
            >
              <UInput
                v-model.number="amountPaid"
                type="number"
                min="0.0"
                :max="total"
                color="primary"
                variant="outline"
                :disabled="total <= 0"
                @change="recalculate"
              />
            </UFormGroup>
            <UFormGroup
              label="الباقى ="
              class="w-auto"
              :ui="{ inner: 'bg-red', wrapper: 'flex', label: { wrapper: 'w-20 h-full' } }"
            >
              <UInput
                v-model.number="amountDue"
                type="number"
                min="0.0"
                color="primary"
                variant="outline"
                disabled
              />
            </UFormGroup>
          </div>
        </div>
        <UDivider class="my-2" />
        <UButtonGroup size="md" class="gap-2 py-2 justify-center cursor-pointer">
          <UButton
            label="حفظ"
            color="white"
            variant="solid"
            icon="i-heroicons-square-2-stack-16-solid"
            :disabled="total <= 0 || !selectedCustomer"
            @click="save"
          />
          <UButton
            label="طباعة"
            color="white"
            variant="solid"
            icon="i-heroicons-printer-solid"
            :disabled="total <= 0 || !selectedCustomer"
          />
          <UButton label="الغاء" color="white" variant="solid" icon="i-heroicons-receipt-refund-solid" />
        </UButtonGroup>
        <!-- </div> -->
        <!-- </div> -->
      </UDashboardPanelContent>
    </UDashboardPanel>

    <UDashboardPanel
      id="pos-invoice"
      v-model="isItemsPanelOpen"
      collapsible
      :width="400"
      resizable
      class="bg-gray-100 dark:bg-gray-800"
    >
      <UDashboardNavbar title="نقطة بيع - POS">
        <template #right>
          <!-- <UButton
            variant="outline"
            label="تحديث"
            size="sm"
            icon="i-heroicons-arrow-path-solid"
            :loading="pending"
            @click="refreshItems"
          /> -->
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar />
      <UDashboardPanelContent>
        <!-- tabs -->
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import { isEmpty } from '@unovis/ts'


const invoiceDate = ref(new Date())
const { data: user } = useAuth()

const itemsList = ref()
const itemsTable = ref()
const isItemsPanelOpen = ref(false)

const customers = ref()
const selectedCustomer = ref()
const searchCustomerQuery = ref('')
const selectedCategories = ref([])
interface InvoiceItem {
  no: number | undefined;
  item: { id: number | undefined, name: string | undefined };
  quantity: number;
  price: number;
  amount: number;
  accountId: number | null
}
const invoiceItems = ref<InvoiceItem[]>([])
Array.from({ length: 50 }).map(() => invoiceItems.value.push({} as InvoiceItem))


const invoiceItemsColumns = ref([
  { key: 'no', label: '#' },
  { key: 'item', label: 'الصنف' },
  { key: 'quantity', label: 'الكمية', class: 'text-center w-28' },
  { key: 'price', label: 'السعر', class: 'text-center w-28' },
  { key: 'amount', label: 'المبلغ', class: 'text-center w-32' },
  { key: 'actions', label: '...', class: 'text-center w-22' },
])

const count = computed(() => invoiceItems.value.reduce((n: number, item: { quantity: number }) => n + (item.quantity || 0), 0))

const countItemQuantity = (id: number) => {
  const item = invoiceItems.value.find((i) => i.item.id == id)
  return item?.quantity! || undefined
}

// calculating
const subTotal = computed<number>(() => invoiceItems.value.reduce((n: number, item: { quantity: number; price: number }) => n + ((item.quantity || 0) * (item.price || 0)), 0))
const itemDiscount = ref<number>(0)
const totalDiscount = ref<number>(0)
const totalDiscountPercentage = computed(() => (((totalDiscount.value) / (subTotal.value)) * 100))
const total = computed(() => ((subTotal.value || 0) - (totalDiscount.value || 0)))
const amountPaid = ref(0)
const amountDue = computed(() => amountPaid.value >= 0 ? ((total.value || 0) - (amountPaid.value || 0)) : 0)

const showCategoryImage = ref(true)

// categories
const { data: categories } = await useLazyFetch<any>('/api/items/categories')

// add invoiceLines
const addItem = (data: any) => {
  const index = invoiceItems.value.findIndex((item: any) => item.id == data.id)
  const item = invoiceItems.value[index]

  if (index !== -1) {
    item.quantity += 1
    item.amount = item.price * item.quantity
  } else {
    invoiceItems.value.push({
      no: undefined,
      item: { id: data.id, name: data.name },
      quantity: 1,
      price: parseInt(data.price),
      amount: parseInt(data.price),
      accountId: null,
    })
  }
}

const decreaseQuantity = (data: any) => {
  const index = invoiceItems.value.findIndex((item: any) => item.id == data.id)
  if (index !== -1) {
    if (invoiceItems.value[index].quantity === 0) return
    invoiceItems.value[index].quantity -= 1
    invoiceItems.value[index].amount =
      invoiceItems.value[index].price * invoiceItems.value[index].quantity
  }
}
const removeItem = (index: number, length?: number) => {
  if (index !== -1) {
    invoiceItems.value.splice(index, length || 1)
  }
}

// const selectCategories = (category: any) => {
//   if (category) {
//     const index = selectedCategories.value.findIndex((c: any) => c.id == category.id)
//     if (index === -1) {
//       selectedCategories.value.push(category)
//     } else {
//       selectedCategories.value.splice(index, 1)
//     }
//   }
// }

// search customers
const loadingCustomers = ref(false)
const searchCustomer = async (q: string = '') => {
  loadingCustomers.value = true
  const customersList: any = await $fetch('/api/entity', {
    query: { q: q, isActive: true, group: 'Customers' },
  })
  loadingCustomers.value = false
  customers.value = customersList.rows
  return customersList.rows
}
// search items
const loadingItems = ref(false)
const searchItem = async (q: string = '') => {
  loadingItems.value = true
  const items = await $fetch<any[]>('/api/items/list', { params: { q } })
  loadingItems.value = false
  return items
}

const updateInvoiceItemsLines = (row: any, index: number) => {
  if (!row.item) {
    removeItem(index)
    return
  }
  const exists = invoiceItems.value.findIndex(i => i.item?.id! == row?.item?.id!)
  const line = invoiceItems.value[exists]
  if (exists !== index) {
    line.quantity += 1
    removeItem(index)
  }
  else {
    line.quantity = 1
    line.price = Number(row.item.price)
  }
  line.amount = Number(line.price) * Number(line.quantity)
  const lastIndex = invoiceItems.value.findLastIndex((item) => !isEmpty(item))
  const prevEmptyLines = invoiceItems.value.filter(i => isEmpty(i) && invoiceItems.value.indexOf(i) < lastIndex)
  removeItem(invoiceItems.value.indexOf(prevEmptyLines[0]), prevEmptyLines.length)
  if(invoiceItems.value.filter((i) => isEmpty(i)).length <= 1) Array.from({ length: 5 }).map(() => invoiceItems.value.push({} as InvoiceItem)
)
}

// Recalculate
const recalculate = () => {
  totalDiscount.value = totalDiscount.value > subTotal.value ? subTotal.value : totalDiscount.value
  totalDiscount.value = totalDiscount.value < 0 ? 0 : totalDiscount.value
  amountPaid.value = amountPaid.value > total.value ? total.value : amountPaid.value
  amountPaid.value = amountPaid.value < 0 ? 0 : amountPaid.value
}

// notification toast
const toast = useToast()

// save invoice in db
const save = async () => {
  const invoiceLines: any[] = []
  invoiceItems.value.map((i) => {
    if (i.item !== undefined) {
      invoiceLines.push({
        itemId: i.item.id,
        price: i.price,
        quantity: i.quantity,
        amount: i.amount,
        accountId: i.accountId,
      })
    }

  })

  const data: any = {
    num: 0,
    type: 'invoice',
    nameId: selectedCustomer.value?.id,
    accountId: undefined,
    userId: user.value?.id,
    date: invoiceDate.value,
    payments: undefined,
    invoiceLines: invoiceLines,
  }
  const result = await $fetch('/api/transactions/invoice', {
    method: 'POST',
    body: data,
  })
  if (result) {
    toast.add({
      id: 'pos-new-invoice',
      description: 'تم الحفظ!',
      color: 'green',
    })
  }
}
</script>

<style></style>
