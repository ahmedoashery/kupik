import { z, date, number, object, string } from 'zod'
import { z, date, number, object, string } from 'zod'

export const UserSchema = object({
  firstname: z.string({ required_error: 'يجب ادخال الاسم الاول' })
  firstname: z.string({ required_error: 'يجب ادخال الاسم الاول' })
    .min(4, ' الحد الادنى 4 احرف')
    .max(200, 'الحد الاقصى 200 !'),

  lastname: string().optional(),

  name: string().optional(),

  email: string({ required_error: 'يجب ادخال بريد الكترونى' })
  email: string({ required_error: 'يجب ادخال بريد الكترونى' })
    .email('بريد الكترونى غيرصحيح!')
    .email('يجب ادخال بريد الكترونى صحيح'),

  password: string({ required_error: 'يجب ادخال كلمة المرور' })
  password: string({ required_error: 'يجب ادخال كلمة المرور' })
    .min(4, ' الحد الادنى 4 احرف')
    .max(200, 'الحد الاقصى 200'),

  contact: string().optional(),
  phone: string().optional(),
  company: string().optional(),
  address: string().optional(),
  city: string().optional(),
  zipcode: string().optional(),
  emailVerified: string().optional(),
  image: string().optional(),
})

export const AuthSchema = object({
  username: string({ required_error: 'يجب ادخال اسم المستخدم' })
  username: string({ required_error: 'يجب ادخال اسم المستخدم' })
    .min(4, ' الحد الادنى 4 احرف')
    .max(200, 'الحد الاقصى 200'),

  password: string({ required_error: 'يجب ادخال كلمة المرور' })
  password: string({ required_error: 'يجب ادخال كلمة المرور' })
    .min(4, ' الحد الادنى 4 احرف')
    .max(200, 'الحد الاقصى 200'),
})


export const InvoicePaymentSchema = object({
  invoiceId: number().optional(),
  accountId: number().optional(),
  date: string(),
  memo: string(),
  amount: number(),
})

export const InvoiceLineSchema = object({
  invoiceId:z.union([z.string(), z.number(), z.undefined(), z.nullable(z.number())]),
  accountId: z.union([z.string(), z.number(), z.undefined(), z.nullable(z.number())]),
  itemId: z.union([z.string(), z.number(), z.undefined(), z.nullable(z.number())]),
  quantity: z.union([z.string(), z.number(), z.undefined(), z.nullable(z.number())]),
  price: z.union([z.string(), z.number(), z.undefined(), z.nullable(z.number())]),
  discount: z.union([z.string(), z.number(), z.undefined(), z.nullable(z.number())]),
  tax: z.union([z.string(), z.number(), z.undefined(), z.nullable(z.number())]),
  amount: z.union([z.string(), z.number(), z.undefined(), z.nullable(z.number())]),
})

export const InvoiceSchema = object({
  id: number().optional(),
  num: number({ required_error: 'رقم الفاتورة مطلوب' }),
  type: string(),
  entityId: number({required_error: 'يجب تحديد العميل!'}),
  accountId: number().optional(),
  userId: string().optional(),
  date: string(),
  payments: z.array(InvoicePaymentSchema).optional().nullable(),
  discount: z.number().nullable(),
  tax: z.number().nullable(),
  invoiceLines: z.array(InvoiceLineSchema).min(1, {message: 'يجب اضافة اصناف/خدمات للفاتورة!'})
})


export const ItemSchema = z.object({
  id: z.union([z.string(), z.number(), z.undefined()]),
  name: z.string({ required_error: 'يجب ادخال الاسم' }).trim().min(3, { message: 'على الاقل 3 احرف' }),
  code: z.string({ invalid_type_error: 'كود غير صحيح' }),
  inventory: z.object({
    id: z.number(),
    name: z.string().trim()
    id: z.number(),
    name: z.string().trim()
  }, { required_error: 'يجب تحديد مخزن' }),
  category: z.object({
    id: z.number(),
    name: z.string().trim()
    id: z.number(),
    name: z.string().trim()
  }, { required_error: 'يجب تحديد تصنيف/مجموعة' }),
  cost: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  isActive: z.boolean().optional()
})


export const InventorySchema = z.object({
  id: z.union([z.string(), z.number(), z.undefined()]),
  name: z.string({ required_error: 'يجب ادخال الاسم' }).trim().min(1, { message: 'على الاقل 1 احرف' }),
})

export const CategorySchema = z.object({
  id: z.union([z.string(), z.number(), z.undefined()]),
  name: z.string({ required_error: 'يجب ادخال الاسم' }).trim().min(1, { message: 'على الاقل 1 احرف' }),
})
