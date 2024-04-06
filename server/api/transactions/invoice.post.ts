import { db } from '~/prisma/db'
import { InvoiceSchema, InvoiceLineSchema } from '~/schemas'

export default eventHandler(async (event) => {
  // const data:any = await readValidatedBody(event, (body) => InvoiceSchema.parse(body))
  const data = await readBody(event)

  const invoice = await db.invoice.create({
    data: {
      date: data.date,
      accountId: data.accountId,
      nameId: data.nameId,
      payments: data.payments,
      type: data.type,
      userId: data.userId,
      num: data.num,
      invoiceLines: {
        createMany: {
          data: data.invoiceLines
        }
      }
    }
  })
  console.log(invoice)

  return invoice
})
