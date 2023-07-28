import { NextFunction, Request, Response } from 'express'
import { comparePassword, createUser, findUserByEmail } from '../../services/user'
import { User, UserWithId } from '../../models/user'
import { generateToken, verifyToken } from '../../utils/jwt'
import { ObjectId } from 'mongodb'
import { getCurrentWeek, getCurrentWeekFromConsiveDate } from '../../utils/week'

type AuthUser = Omit<UserWithId, 'password' | 'salt'> & {
  tokens: {
    refresh: string
    access: string
  }
}

type Me = Omit<UserWithId, 'password' | 'salt'> & { week: string }

export async function signUp(
  req: Request<{}, AuthUser, Omit<User, 'salt'> & { token?: string }>,
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
    // get the token from the body
    const { token, ...rest } = req.body
    let partnerId = undefined
    if (token) {
      const decoded = verifyToken(token) as {
        userId: string
      }
      partnerId = new ObjectId(decoded.userId)
    }
    const user = await createUser({ ...rest, partnerId })
    const accessToken = generateToken({ userId: user._id, type: 'ACCESS' })
    const refreshToken = generateToken({ userId: user._id, type: 'REFRESH' }, { expiresIn: '30d' })
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
    const accessToken = generateToken({ userId: user._id, type: 'ACCESS' })
    const refreshToken = generateToken({ userId: user._id, type: 'REFRESH' }, { expiresIn: '30d' })
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

export async function me(req: Request<{}, Me>, res: Response<Me>, next: NextFunction) {
  try {
    // if consive date
    let week = getCurrentWeek(req.user!.stage, req.user!.createdAt)
    if (req.user?.consiveDate) {
      week = getCurrentWeekFromConsiveDate(req.user!.consiveDate, req.user!.createdAt)
    }
    res.status(200)
    res.json({ ...req.user!, week: week.toString() })
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

    // Todo: need to remove the expiresIn
    const accessToken = generateToken(
      { userId: decoded.userId, type: 'ACCESS' },
      { expiresIn: '4hr' }
    )
    const refreshToken = generateToken(
      { userId: decoded.userId, type: 'REFRESH' },
      { expiresIn: '30d' }
    )

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
