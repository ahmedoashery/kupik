import { db } from "~/prisma/db";

export default eventHandler(async (event) => {
    const maxInvoiceNum = await db.invoice.aggregate({
        _max: {
            num: true
        }
    }).catch((error) => {
        console.error(error)
        throw createError({
            message: 'wrong invoice num'
        })
    })
    
    // return new num = max + 1
    return (maxInvoiceNum._max.num || 0) + 1
})