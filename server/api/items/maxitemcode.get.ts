import { fakerAR as faker } from '@faker-js/faker'
import { db } from '~/prisma/db'

export default eventHandler(async () => {
  const item = await db.item.aggregate({
    _max: {id: true}
  })
  const code = faker.number.int({min: 10000})
  return `${item._max.id||''}${code}`
})
