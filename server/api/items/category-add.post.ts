import { db } from '~/prisma/db'
import { CategorySchema } from '~/schemas'

export default eventHandler(async (event) => {
  const valid = await readValidatedBody(event, (body) => CategorySchema.safeParse(body))
  if (!valid.success) {
    throw createError({
      data: valid.error.issues
    })
  }

  // check unique name
  const exists = await db.category.exists({ name: valid.data.name })

  if (exists) { throw createError({ data: [{ message: 'الاسم مسجل - يرجى اختيار اخر', path: ['category'] }] }) }

  const category = await db.category.create({
    data: {
      name: valid.data.name
    }
  })

  return category
})
