import { Users } from '../../models/user'
import { ObjectId } from 'mongodb'
import { Notifications, type Notification } from './notification.model'

export const notificationEveryFourHours = async () => {
    const users = await Users.find().toArray()

    if (!users) {
        console.log("No Users found")
        return;
    }

    const notifications: Notification[] = users.map((user) => {
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
        }
    })

    await Notifications.insertMany(notifications)
}

export const notificationDailyMidMorning = async () => {
    const users = await Users.find().toArray()

    if (!users) {
        console.log("No User found")
        return;
    }

const notifications: Notification[] = users.map((user) => {
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
        }
    })


    await Notifications.insertMany(notifications)
}

export const notificationDailyEvening = async () => {
    const users = await Users.find().toArray()

    if (!users) {
        console.log("No User found")
        return;
    }

const notifications: Notification[] = users.map((user) => {
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
        }
    })


    await Notifications.insertMany(notifications)
}

export const notificationDailyMidday = async () => {
    const users = await Users.find().toArray()

    if (!users) {
        console.log("No User found")
        return;
    }

const notifications: Notification[] = users.map((user) => {
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
        }
    })


    await Notifications.insertMany(notifications)
}

export const notificationWeeklyEvening = async () => {
    const users = await Users.find().toArray()

    if (!users) {
        console.log("No Users found")
        return;
    }

    const notifications: Notification[] = users.map((user) => {
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
        }
    })

    const fatherNotifications: Notification[] = users.filter(user => user.role === "caregiver").map((user) => {
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
        }
    })

    await Notifications.insertMany(notifications)
    await Notifications.insertMany(fatherNotifications)
}


export const notificationWeeklyFriday = async () => {
    const users = await Users.find().toArray()
    // Check if the users is not compeleting the checklists

    if (!users) {
        console.log("No Users found")
        return;
    }

    const notifications: Notification[] = users.map((user) => {
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
        }
    })

    await Notifications.insertMany(notifications)
}