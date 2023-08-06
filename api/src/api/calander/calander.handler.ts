import { NextFunction, Request, Response } from 'express'
import { Calander, CalanderWithId, Calanders } from '../../models/calander'
import { UserTodos } from '../../models/userTodo'
import { ParamsWithId } from '../../interfaces/ParamsWithId'
import { ObjectId } from 'mongodb'
import { getCurrentWeek, getCurrentWeekFromConsiveDate, getDaysOfWeekForWeek } from '../../utils/week'

export const getAll = async (
  req: Request<{}, any>,
  res: Response<any>,
  next: NextFunction
) => {
  const userCreationDate = req.user!.createdAt
  const userConsiveDate = req.user!.consiveDate

  let week = getCurrentWeek(req.user!.stage, userCreationDate)
  if (userConsiveDate) {
    week = getCurrentWeekFromConsiveDate(userConsiveDate, userCreationDate)
  }

  const days = getDaysOfWeekForWeek(week, new Date(userCreationDate))

  try {
    const calanderTasks = await Calanders.aggregate([
      {
        $match: {
          $or: [
            {
              userId: req.user!._id,
            },
            {
              userId: req.user!.partnerId,
            },
          ],
        },
      },
      {
        $lookup: {
          from:'genetle-reminders',
          localField: 'gentleReminderId',
          foreignField: '_id',
          as:'gentlereminder'
        }
      }
    ]).toArray()
    const userTodos = await UserTodos.aggregate([
      {
        $match: {
          $or: [
            {
              userId: req.user!._id,
            },
            {
              userId: req.user!.partnerId,
            },
          ],
          completionDate: {
            $exists: true,
          },
        },
      },
    ]).toArray()
    res.json({
      days,
      data: [...calanderTasks, ...userTodos]
    })
  } catch (error) {
    next(error)
  }
}

export const createOne = async (
  req: Request<{}, CalanderWithId, Calander>,
  res: Response<CalanderWithId>,
  next: NextFunction
) => {
  try {
    const result = await Calanders.insertOne({ ...req.body, userId: req.user!._id })
    if (!result.acknowledged) {
      throw new Error('Error while insert Calander event')
    }
    res.status(201)
    res.json({
      ...req.body,
      _id: result.insertedId,
    })
  } catch (error) {
    next(error)
  }
}

export const updateOne = async (
  req: Request<ParamsWithId, CalanderWithId, Calander>,
  res: Response<CalanderWithId>,
  next: NextFunction
) => {
  try {
    const result = await Calanders.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
      { returnDocument: 'after' }
    )
    if (!result.ok) {
      throw new Error('Error while updating Calander event')
    }
    res.json(result.value!)
  } catch (error) {
    next(error)
  }
}

export const deleteOne = async (
  req: Request<ParamsWithId>,
  res: Response<{}>,
  next: NextFunction
) => {
  try {
    await Calanders.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    })
    res.status(204)
    res.json({})
  } catch (error) {
    next(error)
  }
}
