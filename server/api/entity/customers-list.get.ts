import { db } from '~/prisma/db'

export default eventHandler(async (event) => {


  const data = await db.entity.findMany()
  return data
})
