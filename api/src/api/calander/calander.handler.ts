import { NextFunction, Request, Response } from 'express'
import { Calander, CalanderWithId, Calanders } from '../../models/calander'
import { UserTodos } from '../../models/userTodo'
import { ParamsWithId } from '../../interfaces/ParamsWithId'
import { ObjectId } from 'mongodb'
import { getCurrentWeek, getCurrentWeekFromConsiveDate, getDaysOfWeekForWeek, getDaysOfWeekFromWeekAndConsiveDate } from '../../utils/week'
import { Planners } from '../../models/planner'

export const getAll = async (
  req: Request<{}, {}, {}, { week?: string }>,
  res: Response<any>,
  next: NextFunction
) => {
  const userCreationDate = req.user!.createdAt
  const userConsiveDate = req.user!.consiveDate

  let week = getCurrentWeek(req.user!.stage, userCreationDate)
  let days = getDaysOfWeekForWeek({weekNumber: week, createdAt: new Date(userCreationDate)})
  if (userConsiveDate) {
    const cw  = getCurrentWeekFromConsiveDate(userConsiveDate, userCreationDate)
    week = cw.week
    days = getDaysOfWeekForWeek({ weekNumber: week, consiveDate: cw.date })
  }
  if (req.query.week) {
    week = parseInt(req.query.week)
    if (userConsiveDate) {
      days = getDaysOfWeekFromWeekAndConsiveDate({weekNumber: parseInt(req.query.week), consiveDate: userConsiveDate})
    } else {
      days = getDaysOfWeekFromWeekAndConsiveDate({weekNumber: parseInt(req.query.week), createdAt: userCreationDate})
    }
  }

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
          $set: {
            gentleReminderId: {
              $toObjectId: "$gentleReminderId"
            }
          }
        },
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

    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    // Map the tasks to their respective days
    const result = days.map((day, index) => {
      const tasks = []

      day.setHours(0, 0, 0, 0);
      tasks.push(...plannerTodos.filter(todo => todo.day === (index + 1).toString()))

      let foundTasks = userTodos.filter((it: any) => {
        let td = it.date;
        if (it.completionDate) {
          td = it.completionDate
        }

        const taskDate: Date = new Date(td);
        taskDate.setHours(0, 0, 0, 0);

        return taskDate.getTime() == day.getTime();
      })
      tasks.push(...foundTasks)

      foundTasks = calanderTasks.filter((it: any) => {
        let td = it.date;
        if (it.completionDate) {
          td = it.completionDate
        }

        const taskDate: Date = new Date(td);
        taskDate.setHours(0, 0, 0, 0);

        return taskDate.getTime() == day.getTime();
      })
      tasks.push(...foundTasks)

      const alternate = ((Math.floor((index) / 7) % 2) === 0) ? true : false;

      day.setHours(0, 0, 0, 0)

      return {
        day,
        tasks,
        alternate
      }
    })

    let data = result.filter(it => it.day.getTime() >= currentDate.getTime())
    if (req.query.week) {
      data = result
    }

    res.json({
      data
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
    const calanderItem = await Calanders.findOne({ _id: new ObjectId(req.params.id )})
    if (calanderItem) {
      const deletedItem = await Calanders.deleteOne({
        _id: new ObjectId(req.params.id),
      })
  
      console.log({ deletedItem })
  
      if (deletedItem.acknowledged) {
        res.status(200)
        return res.json({ success: true })
      }
    }

    const todoItem = await UserTodos.findOne({ _id: new ObjectId(req.params.id )})
    if (todoItem) {

      const updatedItem = await UserTodos.findOneAndUpdate({
        _id: new ObjectId(req.params.id)
      }, {
        $unset: {
          completionDate: 1
        }
      })
  
      console.log({ updatedItem })
  
      if (updatedItem.ok) {
        res.status(200)
        return res.json({ success: true })
      }
    }

    res.status(400)
    return res.json({ message: "Something went wrong"})

  } catch (error) {
    next(error)
  }
}
