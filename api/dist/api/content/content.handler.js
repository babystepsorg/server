"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentForSymptom = exports.getContent = exports.setVideoHistory = void 0;
const contenthistory_1 = require("../../models/contenthistory");
const mongodb_1 = require("mongodb");
const week_1 = require("../../utils/week");
const content_1 = require("../../models/content");
const usersymptoms_1 = require("../../models/usersymptoms");
const symptoms_1 = require("../../models/symptoms");
const setVideoHistory = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const history = await contenthistory_1.ContentHistories.findOneAndUpdate({ contentId: new mongodb_1.ObjectId(req.body.contentId), userId }, { $set: { lastedWatchedAt: new Date().toISOString() } }, { upsert: true });
        if (history && history.ok) {
            res.status(200);
            res.json(history.value);
        }
        else {
            res.status(404);
            throw new Error('Content History not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.setVideoHistory = setVideoHistory;
const getContent = async (req, res, next) => {
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
        const reqWeek = req.query.week ? parseInt(req.query.week) : undefined;
        const { week } = await (0, week_1.getWeekFromUser)(req.user, reqWeek);
        const userSymptoms = await usersymptoms_1.UserSymptoms.aggregate([
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
        ]).toArray();
        let allTags = [];
        for (let i = 0; i < userSymptoms.length; i++) {
            allTags = [...new Set([...allTags, ...(userSymptoms[i]?.tags ?? [])])];
        }
        const contents = await content_1.Contents.aggregate([
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
        ]).toArray();
        const history = await contenthistory_1.ContentHistories.find({ userId: req.user._id }).toArray();
        const watchedContentIds = history.map(h => h.contentId.toString());
        const unwatchedContents = contents.filter(c => !watchedContentIds.includes(c._id.toString()));
        const unwatchedVideos = unwatchedContents.filter(c => c.layout === 'video');
        // const unwatchedPosts = unwatchedContents.filter(c => c.layout === 'post');
        const watchedContent = contents.filter(c => watchedContentIds.includes(c._id.toString()));
        const sortedContents = [...unwatchedVideos, ...watchedContent];
        res.status(200);
        res.json(sortedContents);
    }
    catch (error) {
        next(error);
    }
};
exports.getContent = getContent;
const getContentForSymptom = async (req, res, next) => {
    try {
        const { symptom } = req.params;
        const symptomTags = (await symptoms_1.Symptoms.findOne({ _id: new mongodb_1.ObjectId(symptom) }))?.tags || [];
        const contents = await content_1.Contents.aggregate([
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
    }
    catch (error) {
        next(error);
    }
};
exports.getContentForSymptom = getContentForSymptom;
//# sourceMappingURL=content.handler.js.map