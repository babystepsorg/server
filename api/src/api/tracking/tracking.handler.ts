import { Request, Response, NextFunction } from "express";
import { Trackings } from "./tracking.model";
import { ObjectId } from "mongodb";

export async function storeTrackingData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user
    const { page, duration } = req.body;
    await Trackings.insertOne({
      userId: new ObjectId(user!._id),
      page,
      duration,
      trackedAt: new Date().toISOString()
    });

    res.status(201).json({ message: "Tracking data stored successfully." });
  } catch (error) {
    next(error);
  }
}
