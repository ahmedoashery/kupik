import { db } from '~/prisma/db'

export default eventHandler(async (event) => {
  const { q, group, isActive, page, cursor } = getQuery(event) as {
    q?: string;
    isActive?: boolean;
    group?: string;
    page: number;
    cursor: string;
  }

  const where: any = {
    AND: [
      { group: { name: group || undefined } },
      { isActive: Boolean(isActive) || undefined },
      {
        OR: [
          { firstname: { startsWith: q != '' ? q : undefined } },
          { lastname: { startsWith: q != '' ? q : undefined } },
          { code: { startsWith: q != '' ? q : undefined } },
          { company: { startsWith: q != '' ? q : undefined } },
          { accountNumber: { equals: q != '' ? q : undefined } },
          { phone: { equals: q != '' ? q : undefined } },
          { city: { startsWith: q != '' ? q : undefined } },
          { contact: { startsWith: q != '' ? q : undefined } },
        ],
      },
    ],
  }

  // cursor pagination == infinite scroll
  let data: any = []
  let lastCursor = 0

  const count = await db.entity.count()


  console.log('Entities: initial loading...')
  data = await db.entity.findMany({
    take: 100,
    where,
    include: { group: true },
    orderBy: { id: 'asc' }
  })

  if (data.length !== 0) lastCursor = data[data.length - 1].id

  if (page && page > 1) {
    console.log('Entities: loading more...')
    data = await db.entity.findMany({
      take: 100,
      skip: 1,
      where,
      include: { group: true },
      cursor: { id: parseInt(cursor as string) } || undefined,
      orderBy: { id: 'asc' }
    })

    if (data.length !== 0) lastCursor = data[data.length - 1].id
  }

  return {
    rows: data,
    cursor: lastCursor,
    count
  }
})
