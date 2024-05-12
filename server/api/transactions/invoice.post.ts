import { db } from '~/prisma/db'
import { InvoiceSchema, InvoicePaymentSchema, InvoiceLineSchema } from '~/schemas'

export default eventHandler(async (event) => {
  const valid = await readValidatedBody(event, (body) => InvoiceSchema.safeParse(body))

  if (!valid.success) {
    valid.error.issues.map(i => console.log('path:', i.path, 'message: ', i.message))
    throw createError({
      data: valid.error.issues
    })
  }

  console.log(valid.data)

  // prepare data
  const data: any = {
    num: Number(valid.data.num),
    type: valid.data.type,
    date: valid.data.date,
    entityId: valid.data.entityId,
    accountId: valid.data.accountId,
    // payments: valid.data.payments,
    userId: valid.data.userId,
    discount: valid.data.discount,
    invoiceLines: {
      createMany: {
        data: valid.data.invoiceLines
      }
    }
  }

  // create -- id = undefined
  if (!valid.data.id) {
    const invoice = await db.invoice.create({ data: data })
    return invoice
  }
  // update -- by id
  else {
    const invoice = await db.invoice.update({
      where: { id: valid.data.id },
      data: {
        num: valid.data.num,
        entityId: valid.data.entityId,
        accountId: valid.data.accountId,
        date: valid.data.date,
        type: valid.data.type,
        userId: valid.data.userId,
        invoiceLines:{
          updateMany:{
            where: {},
            data: valid.data.invoiceLines
          }
        }
      },
      include: {invoiceLines: true}
    })
    return invoice
  }
})
