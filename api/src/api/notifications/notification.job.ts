import { Users } from '../../models/user'
import { notificationSchedule, type Notification } from './notifications'

const notifications = notificationSchedule.filter((notification) => notification.channels.includes("Notification"))

export const notificationEveryFourHours = async () => {
    const users = await Users.find({})

    if (!users) {
        console.log("No Users found")
        return;
    }

    const notifications: Notification = {
        type: "notification",
        status: "sent",
        payload: {
            subject: "Stay hydrated, Super Mom! Drink up!",
            message: "",
            action: "none",
        }
    }

    Notifications
}
