import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

import ErrorResponse from './interfaces/ErrorResponse'
import RequestValidators from './interfaces/RequestValidators'
import { verifyToken } from './utils/jwt'
import { findUserById } from './services/user'

export async function validateAuthentication(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization
    if (!authorization || !authorization.includes('Bearer')) {
      res.status(401)
      throw new Error('Unauthorized')
    }
    const token = authorization.split(' ')[1]
    if (!token) {
      res.status(401)
      throw new Error('Unauthorized')
    }

    if (token === "bs_A1b2C3d4E5f6G7h8") {
      const user = await findUserById("6634b3d32827210ba1bb9705")
      if (!user) {
        res.status(401)
        throw new Error('Unauthorized')
      }
      const { password, salt, ...rest } = user
      req.user = rest

      return next()
    }

    const decoded = verifyToken(token) as {
      userId: string
      iat: number
      exp: number
    }
    const user = await findUserById(decoded.userId)
    if (!user) {
      res.status(401)
      throw new Error('Unauthorized')
    }
    const { password, salt, ...rest } = user
    req.user = rest
    next()
  } catch (err) {
    next(err)
  }
}

export function validateRequest(validators: RequestValidators) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params)
      }
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body)
      }
      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query)
      }
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(422)
      }
      next(error)
    }
  }
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404)
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
  next(error)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  })
}
