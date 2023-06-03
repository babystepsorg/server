import { NextFunction, Request, Response } from 'express'
import { UserTodo, UserTodoWithId, UserTodos } from '../../models/userTodo'
import { ParamsWithId } from '../../interfaces/ParamsWithId'
import { ObjectId } from 'mongodb'
import { Todos } from './todo.model'

export const getAll = async (
  req: Request<{}, Array<UserTodoWithId>>,
  res: Response<Array<UserTodoWithId>>,
  next: NextFunction
) => {
  try {
    // Get current week based upon the stage and consive date
    const adminTodos = await Todos.find().toArray()
    const userTodos = await UserTodos.find({
      userId: req.user!._id,
      completed: false,
    }).toArray()

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
      //   const todo = UserTodos.find({ adminTodo: new ObjectId(req.params.id) })
      const result = await UserTodos.insertOne({
        ...data,
        adminTodo: new ObjectId(req.params.id),
        userId: req.user!._id,
      })
      if (!result.acknowledged) throw new Error('Error while updaing task')
      res.json({
        _id: result.insertedId,
        adminTodo: new ObjectId(req.params.id),
        ...data,
      })
    }
    const result = await UserTodos.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
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
