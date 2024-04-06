import { db } from '~/prisma/db'
import { ItemSchema } from '~/schemas'

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, ItemSchema.pick({ id: true }).safeParse)
  if (!query.success) {
    console.log(query)
    throw createError({
      message: 'no id sent!',
      statusCode: 400
    })
  }

  // read body data == updates
  const updates = await readValidatedBody(event, (body) => ItemSchema.safeParse(body))

  if (!updates.success) {
    console.log('item updates errors: ', updates)
    throw createError({
      data: updates.error.issues,
      statusCode: 400
    })
  }

  // begin updating
  console.log('updating Items...: ')
  const item = {
    name: updates.data.name,
    code: updates.data.code.toString(),
    inventoryId: updates?.data?.inventory?.id,
    categoryId: updates?.data?.category?.id,
    cost: updates.data.cost || null,
    price: updates.data.price || null,
    isActive: updates.data.isActive
  }

  await db.item.checkDuplicates(item, query.data.id as number)

  const updatedItem = await db.item.update({
    where: { id: parseInt(query.data.id!.toString()) || undefined },
    data: item

  }).catch((error: any) => {
    console.log('error: ', error.message)
    throw createError({ message: 'خطأ فى تسجيل البيانات', data: error })
  })
  console.log('item updated successfully.')

  return updatedItem
})
