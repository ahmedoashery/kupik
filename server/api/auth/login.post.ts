import { sign } from 'jsonwebtoken'
import { db } from '~/prisma/db'
import { AuthSchema } from '~/schemas'
import { compare } from 'bcrypt'
import { add } from 'date-fns'

const SECRET = useRuntimeConfig().JWT_PRIVATE_KEY

export default eventHandler(async (event) => {
  // validate req body
  const result = await readValidatedBody(event, (body) => AuthSchema.validate(body))

  if (!result) {
    throw createError({
      statusCode: 403,
      message: 'خطا فى التحقق من بيانات الادخال !'
    })
  }

  const { username, password } = result

  // find username in db
  const user = await db.user.findUnique({
    where: {
      name: username as string,

    },
    select: {
      id: true,
      name: true,
      fullname: true,
      email: true,
      image: true,
      password: true,
    }
  })

  if (!user) {
    throw createError({
      statusCode: 403,
      message: 'خطأ فى اسم المستخدم او كلمة المرور'
    })
  }

  // compare passwords
  const match = await compare(password, user?.password!)
  if (!match) {
    throw createError({
      statusCode: 403,
      message: 'خطأ فى اسم المستخدم او كلمة المرور'
    })
  }

  // prepare token  --  delete sensitive data
  const userData = {
    id: user.id,
    email: user.email,
    username: user.name,
    fullname: user.fullname,
  }

  const startedAt = new Date()
  const expiresIn = 15

  const accessToken = sign({ ...userData }, SECRET, { expiresIn })
  const refreshToken = sign({ ...userData }, SECRET, { expiresIn: 60 * 60 * 24 })
  const token = {
    accessToken,
    refreshToken
  }

  // save session in db
  await db.session.create({
    data: {
      sessionToken: token.accessToken,
      userId: user?.id,
      startedAt: startedAt,
      expires: add(startedAt, { seconds: expiresIn })
    }
  })

  // return token to fronend
  return { token }
})
