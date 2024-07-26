import { Request, Response, NextFunction } from "express";

import { UserWithId, Users } from "../../../models/user";
import { ActiveUsers } from "../../../models/activeUser";
import { ParamsWithId } from "../../../interfaces/ParamsWithId";
import { ObjectId } from "mongodb";
import { getWeekFromUser } from "../../../utils/week";

export async function getAllUsers(
  req: Request,
  res: Response<UserWithId[]>,
  next: NextFunction
) {
  try {
    const users = await Users.find().toArray();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request<ParamsWithId>,
  res: Response<{}>,
  next: NextFunction
) {
  try {
    const userId = req.params.id;
    const result = await Users.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      res.status(404);
      throw new Error(`User with id "${userId}" not found.`);
    }

    res.status(200).json({
      message: 'User deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

export async function getUsersStatus(
  req: Request,
  res: Response<{
    totalUsers: number;
    usersByWeek: { [week: string]: number };
    usersByStage: { [stage: string]: number };
  }>,
  next: NextFunction
) {
  try {
    const users = await Users.find().toArray();
    const totalUsers = users.length;

    const usersByWeek: { [week: string]: number } = {};
    const usersByStage: { [stage: string]: number } = {};

    for (const user of users) {
      const { password, salt, ...rest } = user;
      let root = user.partnerId ? true : false
      const { week } = await getWeekFromUser({ ...rest, root });
      const stage = user.stage;

      if (week) {
        usersByWeek[week] = (usersByWeek[week] || 0) + 1;
      }

      if (stage) {
        usersByStage[stage] = (usersByStage[stage] || 0) + 1;
      }
    }

    res.status(200).json({
      totalUsers,
      usersByWeek,
      usersByStage,
    });
  } catch (error) {
    next(error);
  }
}


export async function getActiveUsersByFilter(
  req: Request<{}, {}, { filter: 'daily' | 'weekly' | 'monthly' }>,
  res: Response<{ count: number }>,
  next: NextFunction
) {
  try {
    const { filter } = req.body;
    let date = new Date();

    switch (filter) {
      case 'daily':
        date.setDate(date.getDate() - 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() - 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() - 1);
        break;
      default:
        throw new Error('Invalid filter');
    }

    const activeUsers = await ActiveUsers.find({
      activityTimestamp: { $gte: date.toISOString() }
    }).toArray();

    // const userIds = activeUsers.map(user => user.userId);
    // const users = await Users.find({
    //   _id: { $in: userIds }
    // }).toArray();

    res.status(200).json({ count: activeUsers.length });
  } catch (error) {
    next(error);
  }
}


// export async function getActiveUsers(
//   req: Request<{}, {}, { filter: 'daily' | 'weekly' | 'monthly' }>,
//   res: Response<UserWithId[]>,
//   next: NextFunction
// ) {
//   try {
//     const { filter } = req.body;
//     let date = new Date();

//     switch (filter) {
//       case 'daily':
//         date.setDate(date.getDate() - 1);
//         break;
//       case 'weekly':
//         date.setDate(date.getDate() - 7);
//         break;
//       case 'monthly':
//         date.setMonth(date.getMonth() - 1);
//         break;
//       default:
//         throw new Error('Invalid filter');
//     }

//     const activeUsers = await ActiveUsers.find({
//       activityTimestamp: { $gte: date.toISOString() }
//     }).toArray();

//     const userIds = activeUsers.map(user => user.userId);
//     const users = await Users.find({
//       _id: { $in: userIds }
//     }).toArray();

//     res.status(200).json(users);
//   } catch (error) {
//     next(error);
//   }
// }
