import { db } from '~/prisma/db'
import { InvoiceSchema, InvoicePaymentSchema, InvoiceLineSchema } from '~/schemas'

export default eventHandler(async (event) => {
  const valid = await readValidatedBody(event, (body) => InvoiceSchema.safeParse(body))

  if(!valid.success){
    console.log(JSON.stringify(valid.error.issues))
    throw createError({
      data: valid.error.issues
    })
  }

  const invoice = await db.invoice.create({
    data: {
      num: Number(valid.data.num),
      type: valid.data.type,
      date: valid.data.date,
      entityId: valid.data.entityId,
      accountId: valid.data.accountId,
      payments: valid.data.payments,
      userId: valid.data.userId,
      invoiceLines: {
        createMany: {
          data: valid.data.invoiceLines
        }
      }
    }
  })

  return invoice
})
