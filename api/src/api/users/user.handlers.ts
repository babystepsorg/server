import { NextFunction, Request, Response } from 'express'
import { User, UserWithId, Users } from '../../models/user'
import { ParamsWithId } from '../../interfaces/ParamsWithId'
import { ObjectId } from 'mongodb'
import { createUser, findUserById } from '../../services/user'
import { generateToken } from '../../utils/jwt'

import config from '../../config'
import NotificationService from '../../services/notification'
import { ContentHistories } from '../../models/contenthistory'
import { SelectedSpecialists } from '../../models/selectedSpecialit'
import { Calanders } from '../../models/calander'
import { UserTodos } from '../../models/userTodo'
import { UserSymptoms } from '../../models/usersymptoms'

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
  req: Request<ParamsWithId, Omit<UserWithId, "password" | "salt">, {}>,
  res: Response<Omit<UserWithId, "password" | "salt">>,
  next: NextFunction
) {
  try {
    const result = await findUserById(req.params.id)
    if (!result) {
      res.status(404)
      throw new Error(`User with id "${req.params.id}" not found.`)
    }
    const { password, salt, ...rest} = result;
    res.json(rest)
  } catch (error) {
    next(error)
  }
}

export async function updateOne(
  req: Request<ParamsWithId, Omit<UserWithId, "password" | "salt">, User>,
  res: Response<Omit<UserWithId, "password" | "salt">>,
  next: NextFunction
) {
  
  if (req.body.consiveDate) {
    req.body.stage = "pregnancy"
  }

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
    const { password, salt, ...rest } = result.value;
    res.json(rest)
  } catch (error) {
    next(error)
  }
}

export async function invitePartner(
  req: Request<ParamsWithId, {}, { email: string }>,
  res: Response<{}>,
  next: NextFunction
) {
  const origin = req.headers.origin
  
  try {
    const userId = req.params.id
    const token = generateToken({ type: 'PARTNER', userId }, { expiresIn: '2hr' })
    const email = req.body.email
    const loginLink = `${origin ?? config.CLIENT_URL}/signup?token=${token}`
    const notificationService = new NotificationService()
    await notificationService.sendTemplateEmail({
      email,
      loginLink,
      username: req.user?.name!,
    })

    res.status(200)
    res.json({
      message: 'Email sent to partner',
    })
  } catch (err) {
    next(err)
  }
}

// Add partner to a user
// There are only some items that are going to be different for both user
// (means that both user can see there things)
// But most of the things will be same, what one user adds will be seen by the other

export async function deleteUserByEmail(
  req: Request<{}, {}, { email: string }>,
  res: Response<{}>,
  next: NextFunction
) {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error(`User with email "${email}" not found.`);
    }

    // Delete associated content, specialists, symptoms, and calendar entries
    await Promise.all([
      ContentHistories.deleteMany({ userId: user._id }),
      Calanders.deleteMany({ userId: user._id }),
      SelectedSpecialists.deleteMany({ userId: user._id }),
      UserSymptoms.deleteMany({ userId: user._id }),
      UserTodos.deleteMany({ userId: user._id })
    ]);

    // Finally, delete the user
    await Users.deleteOne({ _id: user._id });

    res.status(200).json({
      message: 'User and all related data deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}
