import { db } from '~/prisma/db'

export default eventHandler(async (event) => {

  const { q } = getQuery(event) as { q: string}

  const items = await db.item.findMany({
    where: {
      name: { startsWith: q != '' ? q.toLowerCase() : undefined }
    }
  })
  return items
})
