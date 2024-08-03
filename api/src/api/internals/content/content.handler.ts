import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb';
import { Todos } from '../../todos/todo.model';
import { UserTodos } from '../../../models/userTodo';
import { Contents } from '../../../models/content';
import { ContentHistories } from '../../../models/contenthistory';

export async function getChecklistsByWeek(
    req: Request<{}, {}, {}, { week: string, weekId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { week, weekId } = req.query
      const [content, contentHistories] = await Promise.all([
        Contents.aggregate([
            {
                $match: {
                    weeks: { $in: [weekId] }
                }
            }
        ]).toArray(),
        ContentHistories.aggregate([
            {
              $match: {
                week
              }
            },
            {
              $lookup: {
                from: "content",
                localField: "contentId",
                foreignField: "_id",
                as: "content"
              }
            },
            {
              $unwind: {
                path: "$content",
                preserveNullAndEmptyArrays: true
              }
            }
          ]).toArray()
      ])

      const contentByWeek: {
        users: string[],
        content: string,
        weekContent: boolean,
      }[] = []

      let contentLeft = contentHistories

      content.forEach(content => {
        // todo what to do 
        const contentId = content._id.toString()
        const userWithContents = contentLeft.filter(userContent => userContent.contentId.toString() === contentId)
        const users = userWithContents.map(userContent => userContent.userId.toString())

        contentLeft = contentLeft.filter(userContent => userContent?.contentId.toString() !== contentId)

        const existingContent = contentByWeek.find(c => c.content === content.title)

        if (!existingContent) {
            contentByWeek.push({
                users,
                content: content.title,
                weekContent: content.weeks.includes(weekId)
            })
        }
      })

      contentLeft.forEach(content => {
        contentByWeek.push({
            users: [content.userId],
            content: content.content.title,
            weekContent: false
        })
      })
      
      res.status(200)
      res.send(contentByWeek)
    } catch (err) {
      next(err)
    }
  }