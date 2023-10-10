import { Request, Response, NextFunction } from "express";
import { ContentHistories, ContentHistoryWithId } from "../../models/contenthistory";
import { ObjectId } from "mongodb";
import { getCurrentWeek, getCurrentWeekFromConsiveDate } from "../../utils/week";
import { Content, ContentWithId, Contents } from "../../models/content";

export const setVideoHistory = async (
  req: Request<{}, ContentHistoryWithId | null, { contentId: string }>,
  res: Response<ContentHistoryWithId | null>,
  next: NextFunction
) => {
  try {
    const userId = req.user!._id;
    const history = await ContentHistories.findOneAndUpdate(
      { contentId: new ObjectId(req.body.contentId), userId },
      { $set: { lastedWatchedAt: new Date().toISOString() } },
      { upsert: true }
    );
    if (history && history.ok) {
      res.status(200);
      res.json(history.value);
    } else {
      res.status(404);
      throw new Error('Content History not found');
    }
  } catch (error) {
    next(error);
  }
}

export const getContent = async (
  req: Request<{}, Array<ContentWithId>, {}, { week?: string, role: string }>,
  res: Response<Array<ContentWithId>>,
  next: NextFunction
) => {
    try {
      const userCreationDate = req.user!.createdAt
      const userConsiveDate = req.user!.consiveDate
  
      let week = getCurrentWeek(req.user!.stage, userCreationDate)
      if (userConsiveDate) {
        const cw  = getCurrentWeekFromConsiveDate(userConsiveDate, userCreationDate)
        week = cw.week
      }
      if (req.query.week) {
        week = parseInt(req.query.week)
      }

      const contents = await Contents.aggregate([
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
                      title: { $eq: week.toString() }
                    }
                  }
                ]
              },
              roles: {
                $in: [req.query.role]
              }
            }
          }
      ]).toArray() as Array<ContentWithId>;
      
      const history = await ContentHistories.find({ userId: req.user!._id }).toArray();
      const watchedContentIds = history.map(h => h.contentId.toString());
      const unwatchedContents = contents.filter(c => !watchedContentIds.includes(c._id.toString()));
      const unwatchedVideos = unwatchedContents.filter(c => c.layout === 'video');
      const unwatchedPosts = unwatchedContents.filter(c => c.layout === 'post');
      const watchedContent = contents.filter(c => watchedContentIds.includes(c._id.toString()));
      const sortedContents = [...unwatchedVideos, ...unwatchedPosts, ...watchedContent];
      res.status(200);
      res.json(sortedContents);
    } catch (error) {
      next(error);
    }
}

