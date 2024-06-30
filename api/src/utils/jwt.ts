import jwt from 'jsonwebtoken'

type JWTOptions = {
  expiresIn?: string | number
}
type TokenType = 'ACCESS' | 'REFRESH' | 'FORGET' | 'PARTNER' | 'VERIFY'

type Data = {
  [key: string]: any
  type: TokenType
}

export const generateToken = (data: Data, options?: JWTOptions) => {
  const token = jwt.sign(data, process.env.JWT_SECRET!, {
    expiresIn: options?.expiresIn || '30m',
  })
  return token
}

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return decoded
  } catch (err) {
    throw new Error('Invalid token')
  }
}
