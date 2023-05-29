import { NextFunction, Request, Response } from 'express'
import { comparePassword, createUser, findUserByEmail } from '../../services/user'
import { User, UserWithId } from '../../models/user'
import { generateToken, verifyToken } from '../../utils/jwt'

type AuthUser = Omit<UserWithId, 'password' | 'salt'> & {
  tokens: {
    refresh: string
    access: string
  }
}

export async function signUp(
  req: Request<{}, AuthUser, Omit<User, 'salt'>>,
  res: Response<AuthUser>,
  next: NextFunction
) {
  try {
    // check if user with this email already exists
    const isMatch = await findUserByEmail(req.body.email)
    if (isMatch) {
      res.status(422)
      throw new Error('User with this email already exists')
    }
    const user = await createUser(req.body)
    const accessToken = generateToken({ userId: user._id })
    const refreshToken = generateToken({ userId: user._id }, { expiresIn: '30d' })
    res.status(201)
    res.json({
      ...user,
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function logIn(
  req: Request<{}, AuthUser, Omit<User, 'salt' | 'stage' | 'role' | 'name'>>,
  res: Response<AuthUser>,
  next: NextFunction
) {
  try {
    const user = await findUserByEmail(req.body.email)
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }
    const isMatch = await comparePassword(req.body.password!, user.password!)
    if (!isMatch) {
      res.status(422)
      throw new Error('Invalid credentials')
    }
    const accessToken = generateToken({ userId: user._id })
    const refreshToken = generateToken({ userId: user._id }, { expiresIn: '30d' })
    const { password, salt, ...rest } = user
    res.status(200)
    res.json({
      ...rest,
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function me(
  req: Request<{}, Omit<User, 'salt' | 'password'> | null>,
  res: Response<Omit<User, 'salt' | 'password'> | null>,
  next: NextFunction
) {
  try {
    res.status(200)
    res.json(req.user)
  } catch (err) {
    next(err)
  }
}

export async function refreshToken(
  req: Request<{}, Pick<AuthUser, 'tokens'>, { refreshToken: string }>,
  res: Response<Pick<AuthUser, 'tokens'>>,
  next: NextFunction
) {
  try {
    const decoded = verifyToken(req.body.refreshToken) as {
      userId: string
    }

    const accessToken = generateToken({ userId: decoded.userId })
    const refreshToken = generateToken({ userId: decoded.userId }, { expiresIn: '30d' })

    res.status(200)
    res.json({
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
    })
  } catch (err) {
    next(err)
  }
}
