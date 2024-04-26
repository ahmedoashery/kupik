import { db } from '~/prisma/db'

export default eventHandler(async () => {
  const invoices = await db.invoice.findMany({
    include: {
      invoiceLines: {
        include: {
          item: true,
         }
      },
      entity: true,
      account: true,
      payments: true,
      user: true
    }
  })
  return invoices
})
