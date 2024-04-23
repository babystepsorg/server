import { Request, Response, NextFunction } from "express";
import { SelectedSpecialists } from "../../models/selectedSpecialit";
import { ObjectId } from "mongodb";

export const addSpecialist = async(
    req: Request<{}, {}, { specialistId: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { specialistId } = req.body;
        const userId = req.user!._id;
        const existingEntry = await SelectedSpecialists.findOne({ userId });

        if (existingEntry) {
            await SelectedSpecialists.updateOne(
                { userId },
                { $push: { specialists: new ObjectId(specialistId) } }
            );
        } else {
            await SelectedSpecialists.insertOne({
                userId,
                specialists: [new ObjectId(specialistId)]
            });
        }

        res.status(200).send({ message: "Specialist added successfully." });
    } catch (err) {
        next(err);
    }
};

export const deleteSpecialist = async(
    req: Request<{}, {}, { specialistId: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { specialistId } = req.body;
        const userId = req.user!._id;
        const existingEntry = await SelectedSpecialists.findOne({ userId });

        if (existingEntry) {
            await SelectedSpecialists.updateOne(
                { userId },
                { $pull: { specialists: new ObjectId(specialistId) } }
            );
            res.status(200).send({ message: "Specialist removed successfully." });
        } else {
            res.status(404).send({ message: "No specialist found to remove." });
        }
    } catch (err) {
        next(err);
    }
};

export const getAllSpecialists = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!._id;
        const specialists = await SelectedSpecialists.aggregate([
            {
                $match: {
                    userId
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
        ]).toArray()

        if (specialists) {
            res.status(200).json(specialists[0]);
        } else {
            res.status(404).send({ message: "No specialists found." });
        }
    } catch (err) {
        next(err);
    }
};
