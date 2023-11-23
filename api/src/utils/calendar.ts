import { Planners } from '../models/planner'
import { User } from '../models/user'
import { getCurrentWeek, getCurrentWeekFromConsiveDate, getDaysOfWeekForWeek } from './week'

export const getUserCalendarEvent = async (user: User) => {
    const userCreationDate = user!.createdAt
    const userConsiveDate = user!.consiveDate

    let week = getCurrentWeek(user!.stage, userCreationDate)
    let days = getDaysOfWeekForWeek({weekNumber: week, createdAt: new Date(userCreationDate)})
    if (userConsiveDate) {
        const cw  = getCurrentWeekFromConsiveDate(userConsiveDate, userCreationDate)
        week = cw.week
        days = getDaysOfWeekForWeek({ weekNumber: week, consiveDate: cw.date })
    }

    try {
        const plannerTodos = await Planners.aggregate([
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
                          { title: { $lt: '44' } },
                          { title: { $gt: '1' } }
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
          ]).toArray();

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
      
            const alternate = ((Math.floor((index) / 7) % 2) === 0) ? true : false;
      
            day.setHours(0, 0, 0, 0)
            day.setHours(9, 0, 0, 0);
            const endDay = new Date(day.getTime() + 30 * 60 * 1000);
      
            return {
              day,
              endDay,
              tasks,
              alternate
            }
          })

          return result;
    } catch (err: any) {
        throw Error(err)
    }


}