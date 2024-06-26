import { Users } from '../../models/user'
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

