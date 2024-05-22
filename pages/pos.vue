<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="نقطة بيع - POS" class="bg-gray-50 dark:bg-gray-700">
        <template #right>
          <UButtonGroup size="md" class="gap-2 py-2 justify-center cursor-pointer">
            <UButton
              label="جديد"
              color="white"
              variant="solid"
              icon="i-heroicons-square-2-stack-16-solid"
              @click="initNewInvoice"
            />
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
            <UButton
              label="الغاء"
              color="white"
              variant="solid"
              icon="i-heroicons-receipt-refund-solid"
              @click="cancel"
            />
          </UButtonGroup>
          <UPagination
            v-model="page"
            :page-count="1"
            :total="invoices?.length!"
            show-first
            show-last
            :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: '', color: 'gray' }"
            :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: '', color: 'gray' }"
            :ui="{
              default: {
                size: 'sm',
                activeButton: {
                  class: 'hidden',
                  color: 'primary',
                },
                inactiveButton: {
                  class: 'hidden',
                  color: 'white',
                }
              }
            }"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar class="bg-white dark:bg-gray-600">
        <template #left>
          <div class="flex justify-between">
            <!-- customer -->
            <UFormGroup label="العميل:">
              <UInputMenu
                ref="customersDropdown"
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

            <!-- invoice num -->
            <ClientOnly>
              <span v-if="invoiceNum" class="align-middle my-3 ms-20">#{{ invoiceNum }}</span>
            </ClientOnly>
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
          :rows="invoice?.invoiceLines!"
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
              :min="1"
              @change="row.price === 0 ? (row.price = 1) : row.price"
            />
          </template>
          <template #discount-data="{ row }">
            <UInput
              v-model.number="row.discount"
              type="number"
              variant="none"
              :min="1"
              @change="row.discount === 0 ? (row.discount = 1) : row.discount"
            />
          </template>
          <template #tax-data="{ row }">
            <UInput
              v-model.number="row.tax"
              type="number"
              variant="none"
              :min="1"
              @change="row.tax === 0 ? (row.tax = 1) : row.tax"
            />
          </template>

          <template #amount-data="{ row }">
            <span v-if="row.quantity && row.price" clss="text-center">{{ (Number(row.quantity * row.price) +
              Number(row.tax||0) - Number(row.discount||0)).toLocaleString() }}</span>
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
              الاجمالى الفرعى = {{ Number(subTotal).toLocaleString('ar-EG', {
                style: 'currency', currency: 'EGP',
                maximumFractionDigits: 0, useGrouping: true, compactDisplay: 'short'
              }) }}
            </div>
            <div>
              نسبةالخصم % = {{ isNaN(totalDiscountPercentage) ? 0 : totalDiscountPercentage.toFixed(2) }} %
            </div>
            <div>
              الاجمالى = {{ total.toLocaleString('ar-EG', {
                style: 'currency', currency: 'EGP',
                maximumFractionDigits: 0,
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
                :disabled="Number(subTotal) <= 0"
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
              <span
                class="relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-sm px-2.5 py-1.5 shadow-sm bg-transparent text-gray-900 dark:text-white ring-1 ring-inset ring-primary-500 dark:ring-primary-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              >{{
                amountDue.toLocaleString('ar-EG', {
                  style: 'currency', currency: 'EGP',
                  maximumFractionDigits: 0, useGrouping: true, compactDisplay: 'short'
                }) }}</span>
              <!-- <UInput
                v-model="amountDue"
                type="number"
                min="0.0"
                color="primary"
                variant="outline"
                disabled
              /> -->
            </UFormGroup>
          </div>
        </div>
        <UDivider class="my-2" />
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
      <UDashboardNavbar title="تاريخ العمليات للعميل">
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
import type { Invoice, InvoiceLine } from '~/types'

const { data: invoices, refresh: refreshInvoices } = await useFetch<Invoice[]>('/api/transactions/invoices')
const invoice = ref<Invoice>()
const page = ref(1)

const { data: maxNum, refresh: refreshInvoiceNum } = await useFetch('/api/transactions/maxInvoiceNum') // init new invoice num
const invoiceNum = ref()
const invoiceDate = ref(new Date())
const { data: loggedInUser } = useAuth()
const user = ref(loggedInUser.value)

const itemsList = ref()
const itemsTable = ref()
const isItemsPanelOpen = ref(false)

const customersDropdown = ref()
const customers = ref()
const selectedCustomer = ref()
const searchCustomerQuery = ref('')

const invoiceItems = ref<InvoiceLine[]>(Array.from({ length: 50 }).map(() => ({} as InvoiceLine)))

// watch for pagination
watch(page, (newPage) => {
  invoice.value = invoices?.value![newPage - 1]
  selectedCustomer.value = invoice.value ? invoice.value?.entity : selectedCustomer.value
  user.value = invoice.value ? invoice.value?.user : loggedInUser.value
  invoiceNum.value = invoice.value ? invoice.value?.num! : maxNum.value
  invoiceItems.value = invoice.value ? invoice.value.invoiceLines : invoiceItems.value
  Array.from({ length: 50 }).map(() => invoice.value?.invoiceLines.push({} as InvoiceLine))
})

const initNewInvoice = async () => {
  invoiceNum.value = maxNum.value
  selectedCustomer.value = undefined
  invoiceItems.value = Array.from({ length: 50 }).map(() => ({} as InvoiceLine))
  const inputId = customersDropdown.value.inputId
  document.getElementById(inputId)?.focus()

  invoice.value = {
    id: undefined,
    num: maxNum.value,
    type: 'invoice',
    date: invoiceDate.value,
    discount: totalDiscount.value,
    tax: tax.value,
    payments: [],
    invoiceLines: invoiceItems.value,
    entity: selectedCustomer.value,
    user: user.value,
    account: undefined,
  } as unknown as Invoice
}

const invoiceItemsColumns = ref([
  { key: 'no', label: '#' },
  { key: 'item', label: 'الصنف' },
  { key: 'quantity', label: 'الكمية', class: 'text-center w-28' },
  { key: 'price', label: 'السعر', class: 'text-center w-28' },
  { key: 'discount', label: 'خصم', class: 'text-center w-28' },
  { key: 'tax', label: 'ضريبة', class: 'text-center w-28' },
  { key: 'amount', label: 'المبلغ', class: 'text-center w-32' },
  { key: 'actions', label: '...', class: 'text-center w-22' },
])


// calculate
const count = computed<number | undefined>(() => invoice.value?.invoiceLines.reduce((n: number, line: any) => n + (Number(line.quantity) || 0), 0))
const subTotal = computed<number | undefined>(() => invoice.value?.invoiceLines.reduce((n: number, line: any) => n + ((Number(line.quantity) || 0) * (Number(line.price) || 0)), 0))
const totalDiscount = ref<number>(0)
const tax = ref<number>(0)
const totalDiscountPercentage = computed<number>(() => (((totalDiscount.value) / Number(subTotal.value)) * 100))
const total = computed<number>(() => ((subTotal.value || 0) - (totalDiscount.value || 0) + (tax.value || 0)))
const amountPaid = ref<number>(0)
const amountDue = computed<number>(() => amountPaid.value >= 0 ? (Number(total.value || 0) - Number(amountPaid.value || 0)) : 0)

const removeItem = (index: number, length?: number) => {
  if (index !== -1) {
    invoiceItems.value.splice(index, length || 1)
  }
}

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

const updateInvoiceItemsLines = (row: InvoiceLine, index: number) => {
  if (!row.item) {
    removeItem(index)
    return
  }
  const exists = invoiceItems.value.findIndex(i => i.item?.id! == row?.item?.id!)
  const line = invoiceItems.value[exists]
  if (exists !== index) {
    line.quantity! = Number(line.quantity) + 1
    removeItem(index)
  }
  else {
    line.quantity = 1
    line.price = Number(row.item.price)
  }
  line.amount = Number(line.price) * Number(line.quantity) + Number(line.tax) - Number(line.discount)
  const lastIndex = invoiceItems.value.findLastIndex((item) => !isEmpty(item))
  const prevEmptyLines = invoiceItems.value.filter(i => isEmpty(i) && invoiceItems.value.indexOf(i) < lastIndex)
  removeItem(invoiceItems.value.indexOf(prevEmptyLines[0]), prevEmptyLines.length)
  if (invoiceItems.value.filter((i) => isEmpty(i)).length <= 1) Array.from({ length: 5 }).map(() => invoiceItems.value.push({} as any)
  )
}

// Recalculate
const recalculate = () => {
  totalDiscount.value = totalDiscount.value > Number(subTotal.value) ? Number(subTotal.value) : totalDiscount.value
  totalDiscount.value = totalDiscount.value < 0 ? 0 : totalDiscount.value
  amountPaid.value = amountPaid.value > total.value ? total.value : amountPaid.value
  amountPaid.value = amountPaid.value < 0 ? 0 : amountPaid.value
}

// notification toast
const toast = useToast()

// save invoice in db
const save = async () => {
  const invoiceLines: InvoiceLine[] = []
  invoiceItems.value.map((i) => {
    if (i.item !== undefined) {
      invoiceLines.push({
        itemId: Number(i.item.id),
        price: Number(i.price),
        quantity: Number(i.quantity),
        discount: i.discount || null||undefined,
        tax: i.tax || null||undefined,
        amount: (Number(i.quantity) * Number(i.price)) - Number(i.discount||0) + Number(i.tax||0),
        accountId: i.accountId || null||undefined,
      })
    }

  })

  const data: any = {
    id: invoice.value?.id,
    num: invoice.value?.num,
    type: 'invoice',
    entityId: selectedCustomer.value?.id,
    accountId: undefined,
    userId: user.value?.id,
    date: invoiceDate.value,
    payments: undefined,
    discount: totalDiscount.value,
    tax: tax.value,
    invoiceLines: invoiceLines,
  }

  console.log('INVOICE: ', invoice.value, '\nDATA: ', data)

  await $fetch('/api/transactions/invoice', {
    method: 'POST',
    body: data,

  }).then(async (result) => {
    if (result) {
      toast.add({
        id: 'pos-new-invoice',
        description: 'تم الحفظ!',
        color: 'green',
      })
    }
  }).catch((error) => { console.error(error) })
    .finally(async () => {
      await refreshInvoiceNum()
      // refresh invoices
      await refreshInvoices()
      // init new invoice
      await initNewInvoice()
    })
}

// cancel
const cancel = async () => {
  // refresh invoices
  await refreshInvoices()
  // init new invoice
  await initNewInvoice()
  // reset pagination
  page.value = 1
  // reset invoice num
  invoiceNum.value = undefined
}

// init new invoice -- on mounted
onMounted(async () => {
  await initNewInvoice()
})
</script>

<style></style>
