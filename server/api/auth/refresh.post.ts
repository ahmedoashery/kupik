import { sign, verify } from 'jsonwebtoken'

export const SECRET = useRuntimeConfig().JWT_PRIVATE_KEY

interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  picture: string;
}

interface JwtPayload extends User {
  scope: Array<'test' | 'user'>;
  exp: number;
}

export default eventHandler(async (event) => {
  const body = await readBody<{ refreshToken: string }>(event)

  if (!body.refreshToken) {
    throw createError({
      statusCode: 403,
      message: 'Unauthorized, no refreshToken in payload'
    })
  }

  const decoded = verify(body.refreshToken, SECRET) as JwtPayload | undefined

  if (!decoded) {
    throw createError({
      statusCode: 403,
      message: 'Unauthorized, refreshToken can`t be verified'
    })
  }

  const expiresIn = 60 * 5 // 5 minutes

  const user: User = {
    id: decoded.id,
    username: decoded.username,
    fullname: decoded.fullname,
    email: decoded.email,
    picture: decoded.picture,
  }

  const accessToken = sign({ ...user, scope: ['test', 'user'] }, SECRET, {
    expiresIn
  })
  const refreshToken = sign({ ...user, scope: ['test', 'user'] }, SECRET, {
    expiresIn: 60 * 60 * 24
  })

  return {
    token: {
      accessToken,
      refreshToken
    }
  }
})
