import { NextFunction, Request, Response } from 'express'
import { Calander, CalanderWithId, Calanders } from '../../models/calander'
import { UserTodos } from '../../models/userTodo'
import { ParamsWithId } from '../../interfaces/ParamsWithId'
import { ObjectId } from 'mongodb'
import { getCurrentWeek, getCurrentWeekFromConsiveDate, getDaysOfWeekForWeek } from '../../utils/week'
import { Planners } from '../../models/planner'

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
    // add the date directly from here
    const [plannerTodos, calanderTasks, userTodos] = await Promise.all([
      Planners.aggregate([
        {
          $addFields: {
            weeks: {
              $map: {
                    input: "$weeks",
                    as: "id",
                    in: {
                      $toObjectId: "$$id"
                    }
                }
            }
          }
        },
        {
          $lookup: {
            from: 'weeks',
            localField: 'weeks',
            foreignField: '_id',
            as: 'week',
          },
        },
        {
          $match: {
            'week.title': week.toString(),
          },
        },
        {
          $addFields: {
            admin: true,
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            roles: 1,
            priority: 1,
            day: 1,
            createdAt: 1,
            updatedAt: 1,
            admin: 1,
          }
        }
      ]).toArray(),
      Calanders.aggregate([
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
      ]).toArray(),
      UserTodos.aggregate([
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
        {
          $lookup: {
            from: 'todos',
            localField: 'adminTodo',
            foreignField: '_id',
            as: 'adminTodo',
          }
        },
        {
          $set: {
            adminTodo: {
              $cond: {
                if: { $gt: [{ $size: '$adminTodo' }, 0] }, // Check if adminTodo array has elements
                then: { $arrayElemAt: ['$adminTodo', 0] }, // If adminTodo array has elements, set the first element
                else: null, // If adminTodo array is empty, set adminTodo to null
              },
            },
            title: {
              $cond: [
                { $gt: [{ $size: '$adminTodo' }, 0] }, // If adminTodo array has elements
                { $arrayElemAt: ['$adminTodo.title', 0] }, // Use adminTodo.title
                '$title' // Use the default title value (change 'defaultTitle' to your preferred default)
              ],
            },
            description: {
              $cond: [
                { $gt: [{ $size: '$adminTodo' }, 0] }, // If adminTodo array has elements
                { $arrayElemAt: ['$adminTodo.description', 0] }, // Use adminTodo.description
                '$description' // Use the default description value (change 'defaultDescription' to your preferred default)
              ],
            },
          },
        },
        {
          $project: {
            adminTodo: 0
          }
        }
      ]).toArray()
    ])
    res.json({
      days,
      data: [...calanderTasks, ...userTodos, ...plannerTodos]
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
