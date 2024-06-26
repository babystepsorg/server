import { NextFunction, Request, Response } from "express";
import { Notifications } from "./notification.model";

export const getAllNotifications = async (
  req: Request<{}, {}, {}, { page?: string, limit?: string }>,
  res: Response<any>,
  next: NextFunction
) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    
    const notifications = await Notifications.find({
      userId: req.user!._id,
      status: "sent"
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

    res.json(notifications);
  } catch (err) {
    next(err);
  }
}

