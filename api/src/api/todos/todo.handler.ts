import { NextFunction, Request, Response } from 'express'
import { UserTodo, UserTodoWithId, UserTodos } from '../../models/userTodo'
import { ParamsWithId } from '../../interfaces/ParamsWithId'
import { ObjectId } from 'mongodb'
import { Todos } from './todo.model'
import { getCurrentWeek, getWeekNumber } from '../../utils/week'

export const getAll = async (
  req: Request<{}, Array<UserTodoWithId>>,
  res: Response<Array<UserTodoWithId>>,
  next: NextFunction
) => {
  try {
    const currentStage = req.user!.stage
    const accountCreationData = req.user!.createdAt
    const week = getCurrentWeek(currentStage, accountCreationData);

    const [adminTodos, userTodos] = await Promise.all([
      Todos.aggregate([
        {
          $addFields: {
            'weekId': {$toObjectId: "$week"}  
          }
        },
        {
          $lookup: {
            from: 'weeks',
            localField: 'weekId',
            foreignField: '_id',
            as: 'week',
          },
        },
        {
          $set: {
            week: {
              $arrayElemAt: ['$week.title', 0],
            },
          },
        },
        {
          $match: {
            'week': week.toString(),
          },
        },
        {
          $addFields: {
            admin: true,
          },
        },
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
        const adminTodoIndex = adminTodos.indexOf(adminTodo)
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
      const adminTodo = UserTodos.find({
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
              assignPartner: data.assignPartner,
              userPriority: data.userPriority,
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
