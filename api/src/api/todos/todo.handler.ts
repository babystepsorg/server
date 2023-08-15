import { NextFunction, Request, Response } from 'express'
import { UserTodo, UserTodoWithId, UserTodos } from '../../models/userTodo'
import { ParamsWithId } from '../../interfaces/ParamsWithId'
import { ObjectId } from 'mongodb'
import { Todos } from './todo.model'
import { getCurrentWeek, getCurrentWeekFromConsiveDate, getWeekNumber } from '../../utils/week'

export const getAll = async (
  req: Request<{}, {}, {}, { week?: string }>,
  res: Response<any>,
  next: NextFunction
) => {
  try {
    const currentStage = req.user!.stage
    const accountCreationData = req.user!.createdAt
    let week = getCurrentWeek(currentStage, accountCreationData);
    if (req.user!.consiveDate) {
      const cw = getCurrentWeekFromConsiveDate(req.user!.consiveDate, accountCreationData)
      week = cw.week
    }
    if (req.query.week) {
      week = parseInt(req.query.week)
    }


    const [adminTodos, userTodos] = await Promise.all([
      Todos.aggregate([
        {
          $addFields: {
            weeks: {
              $map: {
                    input: "$week",
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
            description: 1,
            priority: 1,
            createdAt: 1,
            updatedAt: 1,
            admin: 1
          }
        }
      ]).toArray(),
      UserTodos.find({
        $or: [{ userId: req.user!._id }, { userId: req.user!.partnerId }],
        // completed: false,
      }).toArray(),
    ])

    const userTodosWithoutAdmin = userTodos.filter((todo) => todo.adminTodo === undefined)
    const userTodosWithAdmin = userTodos.filter((todo) => todo.adminTodo !== undefined)

    for (const userAdminTodo of userTodosWithAdmin) {
      const adminTodo = adminTodos.find(
        (todo) => todo._id.toString() === userAdminTodo.adminTodo!.toString()
      )
      if (adminTodo) {
        const { _id, ...rest } = userAdminTodo
        const adminTodoIndex = adminTodos.indexOf((adminTodo as any))
        const updatedTodo = {
          ...adminTodo,
          ...rest,
        }
        adminTodos[adminTodoIndex] = updatedTodo
      }
    }
    res.json([...adminTodos, ...userTodosWithoutAdmin] as any)
  } catch (err) {
    next(err)
  }
}

export const createOne = async (
  req: Request<{}, UserTodoWithId, UserTodo>,
  res: Response<UserTodoWithId>,
  next: NextFunction
) => {
  try {
    const insertedTodo = await UserTodos.insertOne({
      ...req.body,
      userId: req.user!._id,
      completed: false,
    })
    if (!insertedTodo.acknowledged) throw new Error('Error inserting todo')
    res.status(201)
    res.json({
      _id: insertedTodo.insertedId,
      ...req.body,
    })
  } catch (err) {
    next(err)
  }
}

export async function updateOne(
  req: Request<ParamsWithId, UserTodoWithId, UserTodo & { admin?: boolean }>,
  res: Response<UserTodoWithId>,
  next: NextFunction
) {
  try {
    const { admin, ...data } = req.body
    if (admin) {
      // check if it already exist
      const adminTodo = await UserTodos.findOne({
        adminTodo: new ObjectId(req.params.id),
        $or: [{ userId: req.user!._id }, { userId: req.user!.partnerId }],
      })

      if (adminTodo) {
        const result = await UserTodos.findOneAndUpdate(
          {
            adminTodo: new ObjectId(req.params.id),
            $or: [{ userId: req.user!._id }, { userId: req.user!.partnerId }],
          },
          {
            $set: {
              completionDate: data.completionDate,
              assignPartner: data?.assignPartner ?? false,
              userPriority: data?.userPriority ?? 'normal',
            },
          }
        )

        if (result.ok) {
          return res.json(result.value!)
        }

        throw new Error('Something went wrong while updating todo.')
      }
      const result = await UserTodos.insertOne({
        adminTodo: new ObjectId(req.params.id),
        userId: req.user!._id,
        completionDate: data.completionDate,
        assignPartner: data.assignPartner,
        userPriority: data.userPriority,
        completed: false,
      })

      if (!result.acknowledged) throw new Error('Error while updaing task')
      return res.json({
        _id: result.insertedId,
        ...data,
      })
    }
    const result = await UserTodos.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
        $or: [{ userId: req.user!._id }, { userId: req.user!.partnerId }],
      },
      {
        $set: data,
      },
      {
        returnDocument: 'after',
      }
    )
    if (!result.value) {
      res.status(404)
      throw new Error(`Todo with id "${req.params.id}" not found.`)
    }
    res.json(result.value)
  } catch (error) {
    next(error)
  }
}

export async function completeOne(
  req: Request<ParamsWithId, {}, { admin?: boolean }>,
  res: Response<{}>,
  next: NextFunction
) {
  try {
    if (req.body.admin) {
      const adminTodo = await UserTodos.findOne({ adminTodo: new ObjectId(req.params.id) })
      if (adminTodo) {
        await UserTodos.findOneAndUpdate(
          {
            adminTodo: new ObjectId(req.params.id),
            $or: [{ userId: req.user!._id }, { userId: req.user!.partnerId }],
          },
          {
            $set: {
              completed: true,
              completedOn: new Date().toISOString(),
            },
          }
        )

        return res.json({ message: 'Task completed sucessfully' })
      }

      await UserTodos.insertOne({
        adminTodo: new ObjectId(req.params.id),
        completed: true,
        completedOn: new Date().toISOString(),
        userId: req.user!._id,
        userPriority: 'normal',
      })

      return res.json({ message: 'Task completed sucessfully' })
    }
    await UserTodos.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
        $or: [{ userId: req.user!._id }, { userId: req.user!.partnerId }],
      },
      {
        $set: {
          completed: true,
          completedOn: new Date().toISOString(),
        },
      }
    )

    return res.json({ message: 'Task completed sucessfully' })
  } catch (error) {
    next(error)
  }
}

export async function incompleteOne(
  req: Request<ParamsWithId, {}, { admin?: boolean }>,
  res: Response<{}>,
  next: NextFunction
) {
  try {
    if (req.body.admin) {
      const result = await UserTodos.findOneAndUpdate(
        {
          adminTodo: new ObjectId(req.params.id),
          $or: [{ userId: req.user!._id }, { userId: req.user!.partnerId }],
        },
        {
          $set: {
            completed: false,
            completedOn: undefined,
          },
        }
      )

      return res.json({ message: 'Task incompleted sucessfully' })
    }
    await UserTodos.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
        $or: [{ userId: req.user!._id }, { userId: req.user!.partnerId }],
      },
      {
        $set: {
          completed: false,
          completedOn: undefined,
        },
      }
    )

    return res.json({ message: 'Task incompleted sucessfully' })
  } catch (error) {
    next(error)
  }
}


export const deleteOne = async (
  req: Request<ParamsWithId>,
  res: Response<any>,
  next: NextFunction
) => {
  try {
    const deletedTodo = await UserTodos.deleteOne({
      _id: new ObjectId(req.params.id)
    })
    if (!deletedTodo.acknowledged) throw new Error('Error deleting todo')
    res.status(200)
    res.json({
      sucess: true
    })
  } catch (err) {
    next(err)
  }
}
