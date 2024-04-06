import { isArray, isEmpty } from '@unovis/ts'
import { db } from '~/prisma/db'

export default eventHandler(async (event) => {

  // read query object
  const { q, isActive, categories, inventories, page, take, sort, order } = getQuery(event) as {
    q?: string;
    isActive?: string;
    categories?: number[];
    inventories?: number[];
    page?: string;
    take?: string;
    sort?: string;
    order?: string;
  }

  // prepare [Inventories & Categories] filters using list of ids
  const inventoriesFilters = inventories ? isArray(inventories) ? inventories.map((i: any) => JSON.parse(i).id) : [JSON.parse(inventories as any).id] : null
  const categoriesFilters = categories ? isArray(categories) ? categories.map((c: any) => JSON.parse(c).id) : [JSON.parse(categories as any).id] : undefined
  // multiple filters  -- with where operator
  const where: any = {
    AND: [
      { isActive: JSON.parse(isActive as string) ? undefined : true },
      { inventoryId: { in: isEmpty(inventoriesFilters) ? undefined : inventoriesFilters } },
      { categoryId: { in: isEmpty(categoriesFilters) ? undefined : categoriesFilters } },
      {
        OR: [
          { code: { contains: q as string } },
          { name: { contains: q as string } },
          { category: { name: { contains: q as string } } },
          { inventory: { name: { contains: q as string } } },
        ]
      }
    ]
  }

  // prepare orderBy object
  const orderBy: { [prop: string]: any } = {}
  const orderColumns = []
  if (sort && order) {
    if (sort.includes('.')) {
      const s = sort.split('.')
      const o: { [prop: string]: any } = {}
      o[s[1]] = order
      orderBy[s[0]] = o
    }
    else {
      orderBy[sort] = order
    }
    orderColumns.push({ ...orderBy })
  }

  // count all rows for pagination
  const totalCount = await db.item.count({})
  const count = await db.item.count({ where })

  // find data
  const items = await db.item.findMany({
    where,
    include: {
      inventory: true,
      category: true
    },
    take: parseInt(take as string),
    skip: (parseInt(page as string) - 1) * parseInt(take as string),
    orderBy: orderColumns,
  })

  // return object with data and count
  return {
    rows: items,
    count: count, // count of all records (--filters)
    total: totalCount // count of all records (--no-filters)
  }
})
