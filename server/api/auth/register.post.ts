import { db } from '~/prisma/db'
import { UserSchema } from '~/schemas'
import { hash } from 'bcrypt'

export default eventHandler(async (event) => {
  // validate req body
  const data = await readValidatedBody(event, (body) => UserSchema.validate(body))

  if (!data) {
    throw createError({
      statusCode: 403,
      message: 'خطأ فى التسجيل!'
    })
  }

  // check if already exists
  const user = await db.user.findFirst({
    where: {
      OR: [
        { name: data.email.split('@')[0] },
        { email: data.email },
      ]
    },
    select: { id: true }
  })

  if (user) {
    throw createError({
      statusCode: 403,
      message: 'اسم المستخدم موجود , يرجى اختيار اخر'
    })
  }

  // hash password
  const hashed = await hash(data.password, 10)
  data.password = hashed
  const username = data.email.split('@')[0]
  // save data in database
  const registerdUser = await db.user.create({
    data: { ...data, name: username }
  })

  // return registerd data
  return registerdUser

})
