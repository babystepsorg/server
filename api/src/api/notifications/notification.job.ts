import { Users } from '../../models/user'
import { ObjectId } from 'mongodb'
import { Notifications, type Notification } from './notification.model'
import { ActiveUsers } from '../../models/activeUser'
import { getWeekFromUser } from '../../utils/week'
import { date } from 'zod'
import { Todos } from '../todos/todo.model'
import { UserTodos } from '../../models/userTodo'

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


// --------------------------------------------------------------
// -------------------- NEW NOTIFICATIONS -----------------------
// --------------------------------------------------------------

const canSendNotification = async (userId: string) => {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const notificationsCount = await Notifications.countDocuments({
        userId: new ObjectId(userId),
        createdAt: { $gte: todayStart, $lte: todayEnd }
    })

    return notificationsCount < 2
}

export const checkForData = async () => {
    const users = await Users.find().toArray()
    // Check if the users is not compeleting the checklists

    if (!users) {
        console.log("No Users found")
        return;
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 3)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)

    const notifications: Notification[] = []

    users.map(async (user) => {
        // Check users week
        // Check the checklists completed at 6th day
        // Check new week
        // Check user inactivity


        const canSend = await canSendNotification(user._id.toString())
        // const userActivityCount = await ActiveUsers.countDocuments({
        //     userId: new ObjectId(user._id),
        //     activityTimestamp: { $gte: startDate, $lte: endDate }
        // })

        // if (userActivityCount === 0) {
        //     // Send Email
        // }

        const { password, salt, ...rest } = user
        const root = rest.partnerId ? true : false
        const { week, days } = await getWeekFromUser({ ...rest, root })

        let currentWeekDay = 0;
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)

        days.map((day, index) => {
            day.setHours(0, 0, 0, 0)
            if (day === currentDate) {
                currentWeekDay = index
                return;
            }
        })
        
        if (currentWeekDay === 6) {
            // Check the checklist items 
            const [adminTodos, userTodos] = await Promise.all([
                Todos.aggregate([
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
                UserTodos.find({
                  $or: [{ userId: user._id }, { userId: user.partnerId }],
                  // completed: false,
                }).toArray(),
              ])

            // check if all the adminTodo are compeleted and in the userstodos
            const userAdminTodos = userTodos.filter(todo => todo.adminTodo !== undefined)
            const userWithoutAdminTodosCompleted = userTodos.filter(todo => todo.adminTodo === undefined).every((todo) => todo.completed === true)
            
            if (userAdminTodos.length !== adminTodos.length || !userWithoutAdminTodosCompleted) {
                const notification: Notification = {
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
                }

                notifications.push(notification)
            } 

        }

        if (currentWeekDay === 7) {
            // send new week notification for next day
            const notification: Notification = {
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
            }

            notifications.push(notification)
        }

    })

    await Notifications.insertMany(notifications)
}