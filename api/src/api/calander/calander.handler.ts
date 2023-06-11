import { NextFunction, Request, Response } from 'express'
import { Calander, CalanderWithId, Calanders } from '../../models/calander'
import { UserTodos } from '../../models/userTodo'
import { ParamsWithId } from '../../interfaces/ParamsWithId'
import { ObjectId } from 'mongodb'

export const getAll = async (
  req: Request<{}, Array<any>>,
  res: Response<Array<any>>,
  next: NextFunction
) => {
  try {
    const calanderTasks = await Calanders.find({
      $or: [{ userId: req.user!._id }, { userId: req.user!.partnerId }],
    }).toArray()
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
          completionData: {
            $exists: true,
          },
        },
      },
    ]).toArray()
    res.json([...calanderTasks, ...userTodos])
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
