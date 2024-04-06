import { db } from '~/prisma/db'
import { ItemSchema } from '~/schemas'

export default eventHandler(async (event) => {
  const valid = await readValidatedBody(event, (body) => ItemSchema.safeParse(body))

  if (!valid.success) {
    throw createError({ data: valid.error.errors })
  }

  // create
  console.log('Inserting Items...: ')

  // check if item exists name || code
  const dublicateName = await db.item.exists({ name: valid.data.name })
  const dublicateCode = await db.item.exists({ code: valid.data.code })

  if (dublicateCode) {
    throw createError({ data: [{ message: 'الكود مسجل - يرجى اختيار كود اخر', path: ['code'] }] })
  }
  if (dublicateName) {
    throw createError({ data: [{ message: 'الاسم مسجل - يرجى اختيار اسم اخر', path: ['name'] }] })
  }

  const item = await db.item.create({
    data: {
      name: valid.data.name,
      code: valid.data.code,
      inventoryId: valid?.data?.inventory?.id,
      categoryId: valid?.data?.category?.id,
      cost: valid.data.cost || null,
      price: valid.data.price || null,
      isActive: valid.data.isActive
    },

  }).catch((error: any) => {
    console.error('Database Error: ', error.message)
    throw createError({ message: 'خطأ فى تسجيل البيانات', data: error })
  })

  console.log('item successfully added.')

  return item

})
