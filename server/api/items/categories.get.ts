import { db } from '~/prisma/db'

export default eventHandler(async()=>{
  const categories = await db.category.findMany()
  return categories
})
