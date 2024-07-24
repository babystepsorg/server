"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSpecialists = exports.deleteSpecialist = exports.addSpecialist = void 0;
const selectedSpecialit_1 = require("../../models/selectedSpecialit");
const mongodb_1 = require("mongodb");
const addSpecialist = async (req, res, next) => {
    try {
        const { specialistId } = req.body;
        const userId = req.user._id;
        const partnerId = req.user.partnerId;
        const existingEntry = await selectedSpecialit_1.SelectedSpecialists.findOne({
            $or: [
                { userId },
                { userId: partnerId }
            ]
        });
        if (existingEntry) {
            await selectedSpecialit_1.SelectedSpecialists.updateOne({ userId: existingEntry.userId }, { $push: { specialists: new mongodb_1.ObjectId(specialistId) } });
        }
        else {
            await selectedSpecialit_1.SelectedSpecialists.insertOne({
                userId,
                specialists: [new mongodb_1.ObjectId(specialistId)]
            });
        }
        res.status(200).send({ message: "Specialist added successfully." });
    }
    catch (err) {
        next(err);
    }
};
exports.addSpecialist = addSpecialist;
const deleteSpecialist = async (req, res, next) => {
    try {
        const { specialistId } = req.body;
        const userId = req.user._id;
        const partnerId = req.user.partnerId;
        const existingEntry = await selectedSpecialit_1.SelectedSpecialists.findOne({
            $or: [
                { userId },
                { userId: partnerId }
            ]
        });
        if (existingEntry) {
            await selectedSpecialit_1.SelectedSpecialists.updateOne({ userId: existingEntry.userId }, { $pull: { specialists: new mongodb_1.ObjectId(specialistId) } });
            res.status(200).send({ message: "Specialist removed successfully." });
        }
        else {
            res.status(404).send({ message: "No specialist found to remove." });
        }
    }
    catch (err) {
        next(err);
    }
};
exports.deleteSpecialist = deleteSpecialist;
const getAllSpecialists = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const specialists = await selectedSpecialit_1.SelectedSpecialists.aggregate([
            {
                $match: {
                    $or: [
                        {
                            userId: userId,
                        },
                        {
                            userId: req.user.partnerId,
                        },
                    ],
                }
            },
            {
                $lookup: {
                    from: "doctors",
                    let: { specialistIds: "$specialists" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", "$$specialistIds"]
                                }
                            }
                        },
                        {
                            $addFields: {
                                imageObjectId: { $toObjectId: "$image" }
                            }
                        },
                        {
                            $lookup: {
                                from: "media",
                                localField: "imageObjectId",
                                foreignField: "_id",
                                as: "imageArray"
                            }
                        },
                        {
                            $addFields: {
                                image: { $arrayElemAt: ["$imageArray", 0] }
                            }
                        },
                        {
                            $addFields: {
                                "image.url": {
                                    $concat: [
                                        "https://api.babysteps.world/media/",
                                        { $ifNull: ["$image.filename", ""] }
                                    ]
                                }
                            }
                        },
                    ],
                    as: "specialists"
                }
            }
        ]).toArray();
        if (specialists) {
            res.status(200).json(specialists[0]);
        }
        else {
            res.status(404).send({ message: "No specialists found." });
        }
    }
    catch (err) {
        next(err);
    }
};
exports.getAllSpecialists = getAllSpecialists;
//# sourceMappingURL=specialist.handler.js.map