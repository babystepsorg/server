import { Users } from '../../models/user'
import { ObjectId } from 'mongodb'
import { Notifications, type Notification } from './notification.model'

export const testNotification = async () => {
    console.log("Running cron")
    try {
        console.log("Outside client else block")
        const notification = await Notifications.insertOne({
            type: "notification",
            status: "sent",
            payload: {
                subject: "Test Notification",
                message: "This is a test notification",
                action: "none",
            },
            userId: new ObjectId("6676ef6d3330db55f5a97606"),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            read: false,
        })
        console.log("Notification:: ", notification.insertedId)
    } catch (err) {
        console.log("ERROR:: ", err)
    }

}
export const notificationEveryFourHours = async () => {
    const users = await Users.find({})

    if (!users) {
        console.log("No Users found")
        return;
    }

    // const notifications: Notification = {
    //     type: "notification",
    //     status: "sent",
    //     payload: {
    //         subject: "Stay hydrated, Super Mom! Drink up!",
    //         message: "",
    //         action: "none",
    //     },
    //     createdAt: new Date().toISOString(),
    //         updatedAt: new Date().toISOString(),
    //         read: false,
    // }

    // Notifications
}
