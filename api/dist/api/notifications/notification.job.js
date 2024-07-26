"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForData = exports.notificationWeeklyFriday = exports.notificationWeeklyEvening = exports.notificationDailyMidday = exports.notificationDailyEvening = exports.notificationDailyMidMorning = exports.notificationEveryFourHours = void 0;
const user_1 = require("../../models/user");
const mongodb_1 = require("mongodb");
const notification_model_1 = require("./notification.model");
const week_1 = require("../../utils/week");
const todo_model_1 = require("../todos/todo.model");
const userTodo_1 = require("../../models/userTodo");
const notificationEveryFourHours = async () => {
    const users = await user_1.Users.find().toArray();
    if (!users) {
        console.log("No Users found");
        return;
    }
    const notifications = users.map((user) => {
        return {
            type: "notification",
            status: "sent",
            payload: {
                subject: "Stay hydrated, Super Mom! Drink up!",
                message: "",
                action: "none",
            },
            userId: user._id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            read: false
        };
    });
    await notification_model_1.Notifications.insertMany(notifications);
};
exports.notificationEveryFourHours = notificationEveryFourHours;
const notificationDailyMidMorning = async () => {
    const users = await user_1.Users.find().toArray();
    if (!users) {
        console.log("No User found");
        return;
    }
    const notifications = users.map((user) => {
        return {
            type: "notification",
            status: "sent",
            payload: {
                subject: "Time for a little stretch! Here’s your daily move.",
                message: "",
                action: "none",
            },
            userId: user._id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            read: false
        };
    });
    await notification_model_1.Notifications.insertMany(notifications);
};
exports.notificationDailyMidMorning = notificationDailyMidMorning;
const notificationDailyEvening = async () => {
    const users = await user_1.Users.find().toArray();
    if (!users) {
        console.log("No User found");
        return;
    }
    const notifications = users.map((user) => {
        return {
            type: "notification",
            status: "sent",
            payload: {
                subject: "Feel those kicks? Track your baby's dance here.",
                message: "",
                action: "none",
            },
            userId: user._id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            read: false
        };
    });
    await notification_model_1.Notifications.insertMany(notifications);
};
exports.notificationDailyEvening = notificationDailyEvening;
const notificationDailyMidday = async () => {
    const users = await user_1.Users.find().toArray();
    if (!users) {
        console.log("No User found");
        return;
    }
    const notifications = users.map((user) => {
        return {
            type: "notification",
            status: "sent",
            payload: {
                subject: "Feeling things? Update your symptoms!",
                message: "",
                action: "none",
            },
            userId: user._id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            read: false
        };
    });
    await notification_model_1.Notifications.insertMany(notifications);
};
exports.notificationDailyMidday = notificationDailyMidday;
const notificationWeeklyEvening = async () => {
    const users = await user_1.Users.find().toArray();
    if (!users) {
        console.log("No Users found");
        return;
    }
    const notifications = users.map((user) => {
        return {
            type: "notification",
            status: "sent",
            payload: {
                subject: "Check in on your partner! Go on, don't be shy!",
                message: "",
                action: "none",
            },
            userId: user._id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            read: false
        };
    });
    const fatherNotifications = users.filter(user => user.role === "caregiver").map((user) => {
        return {
            type: "notification",
            status: "sent",
            payload: {
                subject: "Hey Dad, time to give mom some extra love today!",
                message: "",
                action: "none",
            },
            userId: user._id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            read: false
        };
    });
    await notification_model_1.Notifications.insertMany(notifications);
    await notification_model_1.Notifications.insertMany(fatherNotifications);
};
exports.notificationWeeklyEvening = notificationWeeklyEvening;
const notificationWeeklyFriday = async () => {
    const users = await user_1.Users.find().toArray();
    // Check if the users is not compeleting the checklists
    if (!users) {
        console.log("No Users found");
        return;
    }
    const notifications = users.map((user) => {
        return {
            type: "notification",
            status: "sent",
            payload: {
                subject: "Hey Dad, time to give mom some extra love today!",
                message: "",
                action: "none",
            },
            userId: user._id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            read: false
        };
    });
    await notification_model_1.Notifications.insertMany(notifications);
};
exports.notificationWeeklyFriday = notificationWeeklyFriday;
// --------------------------------------------------------------
// -------------------- NEW NOTIFICATIONS -----------------------
// --------------------------------------------------------------
const canSendNotification = async (userId) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const notificationsCount = await notification_model_1.Notifications.countDocuments({
        userId: new mongodb_1.ObjectId(userId),
        createdAt: { $gte: todayStart, $lte: todayEnd }
    });
    return notificationsCount < 2;
};
const checkForData = async () => {
    const users = await user_1.Users.find().toArray();
    // Check if the users is not compeleting the checklists
    if (!users) {
        console.log("No Users found");
        return;
    }
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 3);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const notifications = [];
    users.map(async (user) => {
        // Check users week
        // Check the checklists completed at 6th day
        // Check new week
        // Check user inactivity
        const canSend = await canSendNotification(user._id.toString());
        // const userActivityCount = await ActiveUsers.countDocuments({
        //     userId: new ObjectId(user._id),
        //     activityTimestamp: { $gte: startDate, $lte: endDate }
        // })
        // if (userActivityCount === 0) {
        //     // Send Email
        // }
        const { password, salt, ...rest } = user;
        const root = rest.partnerId ? true : false;
        const { week, days } = await (0, week_1.getWeekFromUser)({ ...rest, root });
        let currentWeekDay = 0;
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        days.map((day, index) => {
            day.setHours(0, 0, 0, 0);
            if (day === currentDate) {
                currentWeekDay = index;
                return;
            }
        });
        if (currentWeekDay === 6) {
            // Check the checklist items 
            const [adminTodos, userTodos] = await Promise.all([
                todo_model_1.Todos.aggregate([
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
                userTodo_1.UserTodos.find({
                    $or: [{ userId: user._id }, { userId: user.partnerId }],
                    // completed: false,
                }).toArray(),
            ]);
            // check if all the adminTodo are compeleted and in the userstodos
            const userAdminTodos = userTodos.filter(todo => todo.adminTodo !== undefined);
            const userWithoutAdminTodosCompleted = userTodos.filter(todo => todo.adminTodo === undefined).every((todo) => todo.completed === true);
            if (userAdminTodos.length !== adminTodos.length || !userWithoutAdminTodosCompleted) {
                const notification = {
                    type: "notification",
                    status: "sent",
                    payload: {
                        subject: "You have checklist items left for this week. Complete them now!",
                        message: "",
                        action: "none",
                    },
                    userId: user._id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    read: false
                };
                notifications.push(notification);
            }
        }
        if (currentWeekDay === 7) {
            // send new week notification for next day
            const notification = {
                type: "notification",
                status: "sent",
                payload: {
                    subject: "Welcome to a new week! Check your BabySteps companion for the latest updates and tasks.",
                    message: "",
                    action: "none",
                },
                userId: user._id,
                createdAt: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
                updatedAt: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
                read: false
            };
            notifications.push(notification);
        }
    });
    await notification_model_1.Notifications.insertMany(notifications);
};
exports.checkForData = checkForData;
//# sourceMappingURL=notification.job.js.map