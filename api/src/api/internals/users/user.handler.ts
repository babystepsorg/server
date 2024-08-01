import { Request, Response, NextFunction } from "express";

import { UserWithId, Users } from "../../../models/user";
import { ActiveUsers } from "../../../models/activeUser";
import { ParamsWithId } from "../../../interfaces/ParamsWithId";
import { ObjectId } from "mongodb";
import { getWeekFromUser } from "../../../utils/week";
import { UserSymptoms } from "../../../models/usersymptoms";
import { UserTodos } from "../../../models/userTodo";
import { SelectedSpecialist, SelectedSpecialists } from "../../../models/selectedSpecialit";
import { ContentHistories } from "../../../models/contenthistory";
import { Mentalhealths } from "../../mental-health/mentalHealth.model";
import { Ovulations } from "../../../models/ovulation";
import { Calanders } from "../../../models/calander";
import { Payments } from "../../payments/payment.model";

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

    await Promise.all([
      ContentHistories.deleteMany({ userId: new ObjectId(userId) }),
      Calanders.deleteMany({ userId: new ObjectId(userId) }),
      SelectedSpecialists.deleteMany({ userId: new ObjectId(userId) }),
      UserSymptoms.deleteMany({ userId: new ObjectId(userId) }),
      UserTodos.deleteMany({ userId: new ObjectId(userId) }),
      Payments.deleteMany({ user_id: new ObjectId(userId) })
    ]);

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
    const userSymptoms = await UserSymptoms.aggregate([
      {
        $match: {}
      },
      {
        $lookup: {
          from: "symptoms",
          localField: "symptomId",
          foreignField: "_id",
          as: "symptom"
        }
      },
      {
        $unwind: "$symptom"
      }
    ]).toArray();

    const symptomsByWeeksAndUsers: {
      week: string,
      users: string[],
      symptoms: string[]
    }[] = []

    userSymptoms.map(symptom => {
      const week = symptom.week
      const user = symptom.userId
      const symptomName = symptom.symptom.name

      
    let weekData = symptomsByWeeksAndUsers.find(w => w.week === week);
    if (!weekData) {
      weekData = {
        week: week,
        users: [],
        symptoms: []
      };
      symptomsByWeeksAndUsers.push(weekData);
    }
    weekData.users.push(user.toString());
    weekData.symptoms.push(symptomName);
    })

    res.status(200)
    res.send(symptomsByWeeksAndUsers)
  } catch (err) {
    next(err)
  }
}


// get sypmptoms selected/added in weeks by users
export async function getChecklistsByWeeks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userTodos = await UserTodos.aggregate([
      {
        $match: {}
      },
      {
        $lookup: {
          from: "todos",
          localField: "adminTodo",
          foreignField: "_id",
          as: "todo"
        }
      },
      {
        $unwind: "$todo"
      }
    ]).toArray();

    const checklistsByWeeksAndUsers: {
      week: string,
      users: string[],
      checklists: string[]
    }[] = []

    userTodos.map(todo => {
      const week = todo.week
      const user = todo.userId
      const todoTitle = todo.todo.title

      
    let weekData = checklistsByWeeksAndUsers.find(w => w.week === week);
    if (!weekData) {
      weekData = {
        week: week,
        users: [],
        checklists: []
      };
      checklistsByWeeksAndUsers.push(weekData);
    }
    weekData.users.push(user.toString());
    weekData.checklists.push(todoTitle);
    })

    res.status(200)
    res.send(checklistsByWeeksAndUsers)
  } catch (err) {
    next(err)
  }
}

export async function getSpecialistsAdded(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const specialists = await SelectedSpecialists.aggregate([
      {
        $match: {}
      },
      {
        $lookup: {
            from: "doctors",
            let: { specialistIds: "$specialists" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $in: ["$_id", "$$specialistIds"]
                        }
                    }
                }
            ],
            as: "specialists"
        }
    },
    {
      $unwind: "$specialists"
    }
    ]).toArray()

    res.status(200)
    res.send(specialists)
  } catch (err) {
    next(err)
  }
}

export async function getWatchedVideos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const content = await ContentHistories.aggregate([
      {$match: {}},
      {$lookup: {
        from: "contents",
        localField: "contentId",
        foreignField: "_id",
        as: "content"
      }},
      {
        $unwind: "$content"
      }
    ]).toArray()

    res.status(200)
    res.send(content)
  } catch (err) {
    next(err)
  }
}

export async function getUniqueMentalHealth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const uniqueMentalHealths = await Mentalhealths.aggregate([
      {
        $group: {
          _id: "$userId",
          uniqueMentalHealth: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$uniqueMentalHealth" }
      }
    ]).toArray()

    res.status(200)
    res.send(uniqueMentalHealths)
  } catch (err) {
    next(err)
  }
}

export async function getOvulation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ovulations = await Ovulations.find({}).toArray()

    res.status(200)
    res.json(ovulations)
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
