import { date, number, object, string } from 'yup'
import { z } from 'zod'

export const UserSchema = object({
  firstname: string()
    .required('يجب ادخال الاسم الاول')
    .min(4, ' الحد الادنى 4 احرف')
    .max(200, 'الحد الاقصى 200 !'),

  lastname: string().optional(),

  name: string().optional(),

  email: string()
    .email('بريد الكترونى غيرصحيح!')
    .required('يجب ادخال بريد الكترونى')
    .email('يجب ادخال بريد الكترونى صحيح'),

  password: string()
    .required('يجب ادخال كلمة المرور')
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
  username: string()
    .required('يجب ادخال اسم المستخدم')
    .min(4, ' الحد الادنى 4 احرف')
    .max(200, 'الحد الاقصى 200'),

  password: string()
    .required('يجب ادخال كلمة المرور')
    .min(4, ' الحد الادنى 4 احرف')
    .max(200, 'الحد الاقصى 200'),
})


export const InvoicePaymentSchema = object({
  invoiceId: number(),
  accountId: number(),
  date: date(),
  memo: string(),
  amount: number(),
})

export const InvoiceLineSchema = object({
  invoiceId: number(),
  accountId: number(),
  itemId: number(),
  quantity: number(),
  price: number(),
  amount: number(),
})

export const InvoiceSchema = object({
  num: number().required('رقم الفاتورة مطلوب' ),
  type: string(),
  nameId: number(),
  accountId: number(),
  userId: number(),
  date: date(),
  payments: InvoicePaymentSchema,
  invoiceLines: InvoiceLineSchema
})


export const ItemSchema = z.object({
  id: z.union([z.string(), z.number(), z.undefined()]),
  name: z.string({ required_error: 'يجب ادخال الاسم' }).trim().min(3, { message: 'على الاقل 3 احرف' }),
  code: z.string({ invalid_type_error: 'كود غير صحيح' }),
  inventory: z.object({
      id: z.number(),
      name: z.string().trim()
  }, { required_error: 'يجب تحديد مخزن' }),
  category: z.object({
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
