import { db } from '~/prisma/db'

export default eventHandler(async (event) => {
  const { id } = getQuery(event) as {
    id?: number;
  }

  const item = await db.item.findUnique({
    where: { id: id }
  })
  return item
})
