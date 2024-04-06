import { db } from '~/prisma/db'

export default eventHandler(async()=>{
  const inventories = await db.inventory.findMany()
  return inventories
})
