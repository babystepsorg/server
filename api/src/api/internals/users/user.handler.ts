import { Request, Response, NextFunction } from "express";

import { UserWithId, Users } from "../../../models/user";
import { ActiveUsers } from "../../../models/activeUser";
import { ParamsWithId } from "../../../interfaces/ParamsWithId";
import { ObjectId } from "mongodb";
import { getWeekFromUser } from "../../../utils/week";
import { UserSymptoms } from "../../../models/usersymptoms";

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
    partnerAccounts: number;
  }>,
  next: NextFunction
) {
  try {
    const users = await Users.find().toArray();
    const totalUsers = users.length;
    let partnerAccounts = 0;

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

      if (user.partnerId) {
        partnerAccounts += 1;
      }
    }

    res.status(200).json({
      totalUsers,
      usersByWeek,
      usersByStage,
      partnerAccounts
    });
  } catch (error) {
    next(error);
  }
}

// get sypmptoms selected/added in weeks by users
export async function getSymptomsByWeeks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userSymtpoms = await UserSymptoms.aggregate([
      {
        $lookup: {
          from: "symptoms",
          localField: "symptomId",
          foreignField: "_id",
          as: "symptom"
        }
      },
    ]).toArray()

    const symptomsByWeeksAndUsers: {
      week: string,
      users: Set<string>,
      symptoms: Set<string>
    }[] = []

    userSymtpoms.map(symptom => {
      const week = symptom.week
      const user = symptom.userId
      const symptomtitle = symptom.symptom.title

      const symptomsByWeeksAndUser = symptomsByWeeksAndUsers.find(symp => symp.week === week)
      if (symptomsByWeeksAndUser) {
        symptomsByWeeksAndUser.users.add(user)
        symptomsByWeeksAndUser.symptoms.add(symptomtitle)
      } else {
        symptomsByWeeksAndUsers.push({
          week,
          users: new Set([user]),
          symptoms: new Set([symptomtitle])
        })
      }
    })
  } catch (err) {
    next(err)
  }
}


export async function getActiveUsersByFilter(
  req: Request<{}, {}, { filter: 'daily' | 'weekly' | 'monthly' }>,
  res: Response<{ data: any }>,
  next: NextFunction
) {
  try {
    // const { filter } = req.body;
    // let date = new Date();

    // switch (filter) {
    //   case 'daily':
    //     date.setDate(date.getDate() - 1);
    //     break;
    //   case 'weekly':
    //     date.setDate(date.getDate() - 7);
    //     break;
    //   case 'monthly':
    //     date.setMonth(date.getMonth() - 1);
    //     break;
    //   default:
    //     throw new Error('Invalid filter');
    // }

    const activeUserAgg = [
      {
        $facet: {
          currentYear: [
            {
              $match: {
                activityTimestamp: {
                  $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
                  $lt: new Date(),
                },
              },
            },
            {
              $group: {
                _id: '$userId',
                activityTimestamp: {
                  $first: '$activityTimestamp',
                },
              },
            },
            {
              $group: {
                _id: {
                  year: { $year: '$activityTimestamp' },
                  month: { $month: '$activityTimestamp' },
                },
                userCount: { $sum: 1 },
              },
            },
            {
              $sort: {
                '_id.year': 1,
                '_id.month': 1,
              },
            },
            {
              $project: {
                _id: 0,
                year: '$_id.year',
                month: {
                  $switch: {
                    branches: [
                      { case: { $eq: ['$_id.month', 1] }, then: 'Jan' },
                      { case: { $eq: ['$_id.month', 2] }, then: 'Feb' },
                      { case: { $eq: ['$_id.month', 3] }, then: 'Mar' },
                      { case: { $eq: ['$_id.month', 4] }, then: 'Apr' },
                      { case: { $eq: ['$_id.month', 5] }, then: 'May' },
                      { case: { $eq: ['$_id.month', 6] }, then: 'Jun' },
                      { case: { $eq: ['$_id.month', 7] }, then: 'Jul' },
                      { case: { $eq: ['$_id.month', 8] }, then: 'Aug' },
                      { case: { $eq: ['$_id.month', 9] }, then: 'Sep' },
                      { case: { $eq: ['$_id.month', 10] }, then: 'Oct' },
                      { case: { $eq: ['$_id.month', 11] }, then: 'Nov' },
                      { case: { $eq: ['$_id.month', 12] }, then: 'Dec' },
                    ],
                    default: 'Unknown',
                  },
                },
                userCount: 1,
              },
            },
          ],
          previousCount: [
            {
              $match: {
                activityTimestamp: {
                  $lt: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
                },
              },
            },
            {
              $group: {
                _id: null,
                previousCount: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                previousCount: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          currentYear: 1,
          previousCount: { $arrayElemAt: ['$previousCount.previousCount', 0] },
        },
      },
    ];

   const activeUser = await ActiveUsers.aggregate(activeUserAgg).toArray()

    res.status(200).json({ data: activeUser });
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
