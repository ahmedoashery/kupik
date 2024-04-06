import { db } from '~/prisma/db'
import { InventorySchema } from '~/schemas'

export default eventHandler(async (event) => {
  const valid = await readValidatedBody(event, (body) => InventorySchema.safeParse(body))
  if (!valid.success) {
    throw createError({
      data: valid.error.issues
    })
  }

  // check unique name
  const exists = await db.inventory.exists({ name: valid.data.name })

  if (exists) { throw createError({ data: [{ message: 'الاسم مسجل - يرجى اختيار اخر', path: ['inventory'] }] }) }

  const inventory = await db.inventory.create({
    data: {
      name: valid.data.name
    }
  })

  return inventory
})
