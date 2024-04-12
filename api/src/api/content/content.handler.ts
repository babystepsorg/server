import { Request, Response, NextFunction } from "express";
import { ContentHistories, ContentHistoryWithId } from "../../models/contenthistory";
import { ObjectId } from "mongodb";
import { getCurrentWeek, getCurrentWeekFromConsiveDate, getWeekFromUser } from "../../utils/week";
import { Content, ContentWithId, Contents } from "../../models/content";
import { UserSymptoms } from "../../models/usersymptoms";

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
      // const userCreationDate = req.user!.createdAt
      // const userConsiveDate = req.user!.consiveDate
  
      // let week = getCurrentWeek(req.user!.stage, userCreationDate)
      // if (userConsiveDate) {
      //   const cw  = getCurrentWeekFromConsiveDate(userConsiveDate, userCreationDate)
      //   week = cw.week
      // }
      // if (req.query.week) {
      //   week = parseInt(req.query.week)
      // }

      const reqWeek = req.query.week ? parseInt(req.query.week) : undefined
      const { week } = await getWeekFromUser(req.user!, reqWeek)

      const userSymptoms = await UserSymptoms.aggregate([
				{
					$match: {
						$or: [
							{ userId: req.user?._id },
							{ userId: req.user?.partnerId }
						],
						week
					}
				},
				{
					$lookup: {
						from: 'symptoms',
						localField: 'symptomId',
						foreignField: '_id',
						pipeline: [
							{
								$limit: 1
							}
						],
						as: 'symptom'
					}
				},
				{
					$project: {
						_id: 1,
						symptomId: 1,
						name: { $arrayElemAt: ['$symptom.name', 0] },
						descriptions: { $arrayElemAt: ['$symptom.descriptions', 0] },
						image: { $arrayElemAt: ['$symptom.image', 0] },
						week: 1,
            tags: { $arrayElemAt: ['$symptom.tags', 0] },
					}
				},
			]).toArray()

      let allTags: Array<string> = [];
      for (let i = 0; i < userSymptoms.length; i++) {
        allTags = [...new Set([...allTags, ...(userSymptoms[i]?.tags ?? [])])];
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
              $or: [
                {
                  week: {
                    $all: [
                      {
                        $elemMatch: {
                          title: { $eq: week.toString() }
                        }
                      },
                      {
                        $elemMatch: {
                          title: { $eq: '-10' }
                        }
                      }
                    ]
                  },
                },
                {
                  tags: {
                    $in: allTags
                  }
                }
              ],
              roles: {
                $in: [req.query.role]
              },
            }
          }
      ]).toArray() as Array<ContentWithId>;
      
      const history = await ContentHistories.find({ userId: req.user!._id }).toArray();
      const watchedContentIds = history.map(h => h.contentId.toString());
      const unwatchedContents = contents.filter(c => !watchedContentIds.includes(c._id.toString()));
      const unwatchedVideos = unwatchedContents.filter(c => c.layout === 'video');
      // const unwatchedPosts = unwatchedContents.filter(c => c.layout === 'post');
      const watchedContent = contents.filter(c => watchedContentIds.includes(c._id.toString()));
      const sortedContents = [...unwatchedVideos, ...watchedContent];
      res.status(200);
      res.json(sortedContents);
    } catch (error) {
      next(error);
    }
}

