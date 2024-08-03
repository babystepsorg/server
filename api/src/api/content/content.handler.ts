import { Request, Response, NextFunction } from "express";
import { ContentHistories, ContentHistoryWithId } from "../../models/contenthistory";
import { ObjectId } from "mongodb";
import { getWeekFromUser } from "../../utils/week";
import { ContentWithId, Contents } from "../../models/content";
import { UserSymptoms } from "../../models/usersymptoms";
import { Symptoms } from "../../models/symptoms";

export const setVideoHistory = async (
  req: Request<{}, ContentHistoryWithId | null, { contentId: string }>,
  res: Response<ContentHistoryWithId | null>,
  next: NextFunction
) => {
  try {
    const { week } = await getWeekFromUser(req.user!)
    const userId = req.user!._id;
    const history = await ContentHistories.findOneAndUpdate(
      { contentId: new ObjectId(req.body.contentId), userId },
      { $set: { lastedWatchedAt: new Date().toISOString(), week: week.toString() } },
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
                    // $all: [
                    //   {
                    //     $elemMatch: {
                    //       $or: [
                    //         {
                    //             title: week.toString()
                    //         },
                    //         {
                    //             title: "-10"
                    //         }
                    //       ]
                    //     },
                    //   },
                    // ]
                    $elemMatch: {
                      $or: [
                        {
                          title: week.toString()
                        },
                        {
                          title: "-10"
                        }
                      ]
                    }
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
          },
          {
            $addFields: {
              tags: {
                $map: {
                  input: "$tags",
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
              from: "tags",
              localField: "tags",
              foreignField: "_id",
              as: "tags"
            }
          },
          {
            $project: {
              _id: 1,
              title: 1,
              layout: 1,
              type: 1,
              video_url: 1,
              tags: 1
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

export const getContentForSymptom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symptom } = req.params;
    const symptomTags = (await Symptoms.findOne({ _id: new ObjectId(symptom) }))?.tags || [];
    const contents = await Contents.aggregate([
      {
        $match: {
          tags: { $in: symptomTags }
        }
      },
      // {
      //   $lookup: {
      //     from: 'contenthistories',
      //     localField: '_id',
      //     foreignField: 'contentId',
      //     as: 'history'
      //   }
      // },
      // {
      //   $addFields: {
      //     watched: {
      //       $in: [req.user!._id, '$history.userId']
      //     }
      //   }
      // },
      // {
      //   $match: {
      //     watched: false
      //   }
      // }
    ]).toArray();

    res.status(200).json(contents);
  } catch (error) {
    next(error);
  }
};
