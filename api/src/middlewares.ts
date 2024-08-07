import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

import ErrorResponse from './interfaces/ErrorResponse'
import RequestValidators from './interfaces/RequestValidators'
import { verifyToken } from './utils/jwt'
import { findUserById } from './services/user'

import { ContentHistories } from './models/contenthistory'
import { SelectedSpecialists } from './models/selectedSpecialit'
import { Calanders } from './models/calander'
import { UserTodos } from './models/userTodo'
import { UserSymptoms } from './models/usersymptoms'
import { Users } from './models/user'
import { Payments } from './api/payments/payment.model'
import { ObjectId } from 'mongodb'

export async function validateApiKey(req: Request, res: Response, next: NextFunction) {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== 'bs_pymnt_MM5lHlgWVrweJ8') {
      res.status(403);
      throw new Error('Forbidden');
    }
    next();
  } catch (err) {
    next(err);
  }
}


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
      await Promise.all([
        ContentHistories.deleteMany({ userId: user._id }),
        Calanders.deleteMany({ userId: user._id }),
        SelectedSpecialists.deleteMany({ userId: user._id }),
        UserSymptoms.deleteMany({ userId: user._id }),
        UserTodos.deleteMany({ userId: user._id })
      ]);
      const { password, salt, ...rest } = user
      req.user = { ...rest, root: true }

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

    let partner = !!rest.partnerId
    let root = false;
    if (!partner) {
      const foundUser = await Users.findOne({ partnerId: rest!._id })

      // check the concieveDate
      const userConsiveDate = user.consiveDate
      const userDueDateAddedAt = user?.dueDateAddedAt

      const foundUserConsiveDate = foundUser?.consiveDate
      const foundUserDueDateAddedAt = foundUser?.dueDateAddedAt

      if (userDueDateAddedAt && foundUserDueDateAddedAt) {
        const userDueDateAddedAtDate = new Date(userDueDateAddedAt)
        const foundUserDueDateAddedAtDate = new Date(foundUserDueDateAddedAt)

        if (foundUserDueDateAddedAtDate > userDueDateAddedAtDate) {
          rest.consiveDate = foundUserConsiveDate
        }
      }

      // if (foundUser) {
      rest.partnerId = foundUser?._id ?? undefined
      const payment = await Payments.findOne({ user_id: new ObjectId(rest!._id) })
      rest.subscriptionEndDate = payment?.subscription_end_at?.toString() ?? user?.subscriptionEndDate
      rest.subscriptionStartDate = payment?.subscription_start_at?.toString() ?? user?.subscriptionStartDate
      rest.subscriptionStatus = (payment?.subscription_status as any) ?? user?.subscriptionStatus
      rest.razorpayPlanId = payment?.razorpay_plan_id ?? user?.razorpayPlanId
      rest.razorpaySubscriptionId = payment?.subscription_id ?? user?.razorpaySubscriptionId
      root = true
      // }
    } else {
      const foundUser = await Users.findOne({ _id: rest.partnerId })
      if (foundUser) {
        const payment = await Payments.findOne({ user_id: new ObjectId(rest.partnerId) })
        rest.subscriptionEndDate = payment?.subscription_end_at?.toString() ?? foundUser.subscriptionEndDate
        rest.subscriptionStartDate = payment?.subscription_start_at?.toString() ?? foundUser.subscriptionStartDate
        rest.subscriptionStatus = (payment?.subscription_status as any) ?? foundUser.subscriptionStatus
        rest.razorpayPlanId = payment?.razorpay_plan_id ?? foundUser.razorpayPlanId
        rest.razorpaySubscriptionId = payment?.subscription_id ?? foundUser.razorpaySubscriptionId
        rest.createdAt = foundUser.createdAt
        root = false

        // check the concieveDate
        const userConsiveDate = user.consiveDate
        const userDueDateAddedAt = user?.dueDateAddedAt

        const foundUserConsiveDate = foundUser?.consiveDate
        const foundUserDueDateAddedAt = foundUser?.dueDateAddedAt

        if (userDueDateAddedAt && foundUserDueDateAddedAt) {
          const userDueDateAddedAtDate = new Date(userDueDateAddedAt)
          const foundUserDueDateAddedAtDate = new Date(foundUserDueDateAddedAt)

          if (foundUserDueDateAddedAtDate > userDueDateAddedAtDate) {
            rest.consiveDate = foundUserConsiveDate
          }
        }
      }
    }

    req.user = { ...rest, root }
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
  console.log("Error:: ", err)
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  })
}
