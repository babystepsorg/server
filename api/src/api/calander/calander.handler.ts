import { NextFunction, Request, Response } from 'express'
import { Calander, CalanderWithId, Calanders } from '../../models/calander'
import { UserTodos } from '../../models/userTodo'
import { ParamsWithId } from '../../interfaces/ParamsWithId'
import { ObjectId } from 'mongodb'
import { getCurrentWeek, getCurrentWeekFromConsiveDate, getDaysOfWeekForWeek, getDaysOfWeekFromWeekAndConsiveDate, getWeekFromUser } from '../../utils/week'
import { Planners } from '../../models/planner'
import { Ovulation, OvulationWithId, Ovulations } from '../../models/ovulation'
import { Users } from '../../models/user'

export const getAll = async (
  req: Request<{}, {}, {}, { week?: string }>,
  res: Response<any>,
  next: NextFunction
) => {
  let userCreationDate = req.user!.createdAt
  let userConsiveDate = req.user!.consiveDate

  if (req.user!.partnerId) {
    const partnerUser = await Users.findOne({ _id: new ObjectId(req.user!.partnerId) })
    if (partnerUser) {
      userCreationDate = partnerUser.createdAt
      userConsiveDate = partnerUser.consiveDate
    }
  }

  console.log({ userConsiveDate, userCreationDate })

  // const reqWeek = req.query.week ? parseInt(req.query.week) : undefined
  // let { week } = await getWeekFromUser(req.user!, reqWeek, true)
  let { week } = await getWeekFromUser(req.user!, req.query?.week ? + req.query.week : undefined)
  let days = getDaysOfWeekForWeek({weekNumber: week as number, createdAt: new Date(userCreationDate)})
  if (userConsiveDate) {
    days = getDaysOfWeekForWeek({ weekNumber: week, consiveDate: new Date(userConsiveDate) })
  }
  if (req.query.week) {
    week = parseInt(req.query.week)
    if (userConsiveDate) {
      days = getDaysOfWeekFromWeekAndConsiveDate({weekNumber: parseInt(req.query.week), consiveDate: userConsiveDate})
    } else {
      days = getDaysOfWeekFromWeekAndConsiveDate({weekNumber: parseInt(req.query.week), createdAt: userCreationDate})
    }
  }

  try {
    // add the date directly from here
    const [plannerTodos, calanderTasks, userTodos] = await Promise.all([
      Planners.aggregate([
        {
          $addFields: {
            weeks: {
              $map: {
                    input: "$weeks",
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
            week: {
              $all: [
                {
                  $elemMatch: {
                    $and: [
                      { title: { $lt: (week + 4).toString() } },
                      { title: { $gt: week.toString() } }
                    ]
                  }
                }
              ]
            }
          }
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
            roles: 1,
            priority: 1,
            day: 1,
            createdAt: 1,
            updatedAt: 1,
            admin: 1,
            color: 1,
            week: 1
          }
        }
      ]).toArray(),
      Calanders.aggregate([
        {
          $set: {
            gentleReminderId: {
              $toObjectId: "$gentleReminderId"
            }
          }
        },
        {
          $match: {
            $or: [
              {
                userId: req.user!._id,
              },
              {
                userId: req.user!.partnerId,
              },
            ],
          },
        },
        {
          $lookup: {
            from:'genetle-reminders',
            localField: 'gentleReminderId',
            foreignField: '_id',
            as:'gentlereminder'
          }
        }
      ]).toArray(),
      UserTodos.aggregate([
        {
          $match: {
            $or: [
              {
                userId: req.user!._id,
              },
              {
                userId: req.user!.partnerId,
              },
            ],
            completionDate: {
              $exists: true,
            },
          },
        },
        {
          $lookup: {
            from: 'todos',
            localField: 'adminTodo',
            foreignField: '_id',
            as: 'adminTodo',
          }
        },
        {
          $set: {
            adminTodo: {
              $cond: {
                if: { $gt: [{ $size: '$adminTodo' }, 0] }, // Check if adminTodo array has elements
                then: { $arrayElemAt: ['$adminTodo', 0] }, // If adminTodo array has elements, set the first element
                else: null, // If adminTodo array is empty, set adminTodo to null
              },
            },
            title: {
              $cond: [
                { $gt: [{ $size: '$adminTodo' }, 0] }, // If adminTodo array has elements
                { $arrayElemAt: ['$adminTodo.title', 0] }, // Use adminTodo.title
                '$title' // Use the default title value (change 'defaultTitle' to your preferred default)
              ],
            },
            description: {
              $cond: [
                { $gt: [{ $size: '$adminTodo' }, 0] }, // If adminTodo array has elements
                { $arrayElemAt: ['$adminTodo.description', 0] }, // Use adminTodo.description
                '$description' // Use the default description value (change 'defaultDescription' to your preferred default)
              ],
            },
          },
        },
        {
          $project: {
            adminTodo: 0
          }
        }
      ]).toArray(),
    ])

    const ovulation = await Ovulations.findOne({ userId: req.user!._id })

    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    // Map the tasks to their respective days
    const result = days.map((day, index) => {
      const tasks = []

      day.setHours(0, 0, 0, 0);
      let currentWeek = Math.floor(index / 7);
      currentWeek += week;
      
      const todosForCurrentWeek = plannerTodos.filter(todo => todo.week.some((w: any) => w.title === currentWeek.toString()))
      
      if (currentWeek === week) {
        tasks.push(...todosForCurrentWeek.filter(todo => todo.day === (index + 1).toString()))
      } else {
        const weekMoreThanCurrent = currentWeek - week;
        const dayForWeek = (index + 1) - (weekMoreThanCurrent * 7);
        tasks.push(
          ...todosForCurrentWeek.filter(todo => {
            const day = todo.day;
            return day === dayForWeek.toString();
          })
        )
      }

      let foundTasks = userTodos.filter((it: any) => {
        let td = it.date;
        if (it.completionDate) {
          td = it.completionDate
        }

        const taskDate: Date = new Date(td);
        taskDate.setHours(0, 0, 0, 0);

        return taskDate.getTime() == day.getTime();
      })
      tasks.push(...foundTasks)

      foundTasks = calanderTasks.filter((it: any) => {
        let td = it.date;
        if (it.completionDate) {
          td = it.completionDate
        }

        const taskDate: Date = new Date(td);
        taskDate.setHours(0, 0, 0, 0);

        return taskDate.getTime() == day.getTime();
      })
      tasks.push(...foundTasks)

      const currentDay = day.toLocaleDateString('en-IN', { weekday: 'long' })
      foundTasks = calanderTasks.filter((it:any) => {
        if (it.gentleReminderId) {
          const repeat = it.repeat
          if (repeat && repeat.includes(currentDay.toLowerCase())) {
            return true
          };
          return false;
        }
        return false;
      })
      tasks.push(...foundTasks)

      const alternate = ((Math.floor((index) / 7) % 2) === 0) ? true : false;

      day.setHours(0, 0, 0, 0)

      let _ovulation = false;
      let _ovulationMain = false;
      if (ovulation) {
        const ov = new Date(ovulation.ovultaionDate)
        ov.setHours(0, 0, 0, 0)
        const fws = new Date(ovulation.fertileWindowStart)
        fws.setHours(0, 0, 0, 0)
        const fwe = new Date(ovulation.fertileWindowEnd)
        fwe.setHours(0, 0, 0, 0)

        if (day >= fws && day <= fwe) {
          _ovulation = true
        }

        if (day.getTime() === ov.getTime()) {
          _ovulationMain = true
        }
      }

      return {
        day,
        tasks,
        alternate,
        _ovulation,
        _ovulationMain
      }
    })

    let data = result.filter(it => it.day.getTime() >= currentDate.getTime())
    if (req.query.week) {
      data = result
    }

    res.json({
      data
    })
  } catch (error) {
    next(error)
  }
}

export const createOne = async (
  req: Request<{}, CalanderWithId, Calander>,
  res: Response<CalanderWithId>,
  next: NextFunction
) => {
  try {
    const result = await Calanders.insertOne({ ...req.body, userId: req.user!._id })
    if (!result.acknowledged) {
      throw new Error('Error while insert Calander event')
    }
    res.status(201)
    res.json({
      ...req.body,
      _id: result.insertedId,
    })
  } catch (error) {
    next(error)
  }
}

export const updateOne = async (
  req: Request<ParamsWithId, CalanderWithId, Calander>,
  res: Response<CalanderWithId>,
  next: NextFunction
) => {
  try {
    const result = await Calanders.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
      { returnDocument: 'after' }
    )
    if (!result.ok) {
      throw new Error('Error while updating Calander event')
    }
    res.json(result.value!)
  } catch (error) {
    next(error)
  }
}

export const deleteOne = async (
  req: Request<ParamsWithId>,
  res: Response<{}>,
  next: NextFunction
) => {
  try {
    const calanderItem = await Calanders.findOne({ _id: new ObjectId(req.params.id )})
    if (calanderItem) {
      const deletedItem = await Calanders.deleteOne({
        _id: new ObjectId(req.params.id),
      })
    
      if (deletedItem.acknowledged) {
        res.status(200)
        return res.json({ success: true })
      }
    }

    const todoItem = await UserTodos.findOne({ _id: new ObjectId(req.params.id )})
    if (todoItem) {

      const updatedItem = await UserTodos.findOneAndUpdate({
        _id: new ObjectId(req.params.id)
      }, {
        $unset: {
          completionDate: 1
        }
      })
    
      if (updatedItem.ok) {
        res.status(200)
        return res.json({ success: true })
      }
    }

    res.status(400)
    return res.json({ message: "Something went wrong"})

  } catch (error) {
    next(error)
  }
}

export const createOrUpdateGR = async (
  req: Request<{}, CalanderWithId, Calander>,
  res: Response<CalanderWithId>,
  next: NextFunction
) => {
  try {
    const gentleReminderId = new ObjectId(req.body.gentleReminderId)
    req.body.gentleReminderId = gentleReminderId
    const gr = await Calanders.findOneAndUpdate(
      { gentleReminderId, userId: req.user!._id },
      { $set: { ...req.body } },
      { upsert: true }
    );
    if (!gr.ok) {
      throw new Error('Something went wrong.')
    }
    res.status(200)
    return res.json({
      ...req.body,
      _id: gentleReminderId
    })
  } catch (error) {
    next(error)
  }
}

export const getGentleReminderDoc = async (
  req: Request<ParamsWithId, CalanderWithId, Calander>,
  res: Response<CalanderWithId>,
  next: NextFunction
) => {
  try {
    const gentleReminder = await Calanders.findOne({ gentleReminderId: new ObjectId(req.params.id), userId: req.user!._id });
    if (!gentleReminder) {
      throw new Error('Error while getting Gentle Reminder')
    }
    res.status(200)
    res.json(gentleReminder)
  } catch (error) {
    next(error)
  }
}

export const createOrUpdateOvulation = async (
  req: Request<{}, OvulationWithId, Ovulation>,
  res: Response<OvulationWithId>,
  next: NextFunction
) => {
  try {
    const ovulation = await Ovulations.findOneAndUpdate(
      { userId: req.user!._id }, 
      { $set: { ...req.body, } }, 
      { upsert: true }
    )

    if (!ovulation.ok) {
      throw new Error('Error while updating ovulation.')
    }

    res.status(200)
    res.send(ovulation.value!)
  } catch (err) {
    next(err)
  }
}