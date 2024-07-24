"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationWeeklyFriday = exports.notificationWeeklyEvening = exports.notificationDailyMidday = exports.notificationDailyEvening = exports.notificationDailyMidMorning = exports.notificationEveryFourHours = void 0;
const user_1 = require("../../models/user");
const notification_model_1 = require("./notification.model");
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
//# sourceMappingURL=notification.job.js.map