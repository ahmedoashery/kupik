import { db } from '~/prisma/db'

export default eventHandler(async () => {
  const maxInvoiceId = await db.invoice.aggregate({
    _max: { id: true }
  }).catch((error) => {
    console.error(error)
    throw createError({
      message: 'wrong invoice num'
    })
  })
  const max = maxInvoiceId._max.id
  return (max! + 1) || 1
})
