import { NextFunction, Request, Response } from 'express'
import { User, UserWithId, Users } from '../../models/user'
import { ParamsWithId } from '../../interfaces/ParamsWithId'
import { ObjectId } from 'mongodb'
import { createUser, findUserById } from '../../services/user'

export async function createOne(
  req: Request<{}, Omit<UserWithId, 'password' | 'salt'>, User>,
  res: Response<Omit<UserWithId, 'password' | 'salt'>>,
  next: NextFunction
) {
  try {
    const user = await createUser(req.body)
    res.status(201)
    res.json(user)
  } catch (err) {
    next(err)
  }
}

export async function findOne(
  req: Request<ParamsWithId, UserWithId, {}>,
  res: Response<UserWithId>,
  next: NextFunction
) {
  try {
    const result = await findUserById(req.params.id)
    if (!result) {
      res.status(404)
      throw new Error(`User with id "${req.params.id}" not found.`)
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function updateOne(
  req: Request<ParamsWithId, UserWithId, User>,
  res: Response<UserWithId>,
  next: NextFunction
) {
  try {
    const result = await Users.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: req.body,
      },
      {
        returnDocument: 'after',
      }
    )
    if (!result.value) {
      res.status(404)
      throw new Error(`User with id "${req.params.id}" not found.`)
    }
    res.json(result.value)
  } catch (error) {
    next(error)
  }
}
