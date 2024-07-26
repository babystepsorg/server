"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveUsersByFilter = exports.getUsersStatus = exports.deleteUser = exports.getAllUsers = void 0;
const user_1 = require("../../../models/user");
const activeUser_1 = require("../../../models/activeUser");
const mongodb_1 = require("mongodb");
const week_1 = require("../../../utils/week");
async function getAllUsers(req, res, next) {
    try {
        const users = await user_1.Users.find().toArray();
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
}
exports.getAllUsers = getAllUsers;
async function deleteUser(req, res, next) {
    try {
        const userId = req.params.id;
        const result = await user_1.Users.deleteOne({ _id: new mongodb_1.ObjectId(userId) });
        if (result.deletedCount === 0) {
            res.status(404);
            throw new Error(`User with id "${userId}" not found.`);
        }
        res.status(200).json({
            message: 'User deleted successfully.'
        });
    }
    catch (error) {
        next(error);
    }
}
exports.deleteUser = deleteUser;
async function getUsersStatus(req, res, next) {
    try {
        const users = await user_1.Users.find().toArray();
        const totalUsers = users.length;
        const usersByWeek = {};
        const usersByStage = {};
        for (const user of users) {
            const { password, salt, ...rest } = user;
            let root = user.partnerId ? true : false;
            const { week } = await (0, week_1.getWeekFromUser)({ ...rest, root });
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
    }
    catch (error) {
        next(error);
    }
}
exports.getUsersStatus = getUsersStatus;
async function getActiveUsersByFilter(req, res, next) {
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
        const activeUsers = await activeUser_1.ActiveUsers.find({
            activityTimestamp: { $gte: date.toISOString() }
        }).toArray();
        // const userIds = activeUsers.map(user => user.userId);
        // const users = await Users.find({
        //   _id: { $in: userIds }
        // }).toArray();
        res.status(200).json({ count: activeUsers.length });
    }
    catch (error) {
        next(error);
    }
}
exports.getActiveUsersByFilter = getActiveUsersByFilter;
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
//# sourceMappingURL=user.handler.js.map