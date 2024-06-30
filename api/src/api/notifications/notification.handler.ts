import { NextFunction, Request, Response } from "express";
import { Notifications } from "./notification.model";
import { ObjectId } from "mongodb";

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

    const totalDocs = await Notifications.countDocuments({
      userId: req.user!._id,
      status: "sent"
    });

    const totalPages = Math.ceil(totalDocs / limit);

    const paginatedResponse = {
      docs: notifications,
      totalDocs,
      limit,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    };

    res.status(200)
    res.send(paginatedResponse)
  } catch (err) {
    next(err);
  }
}

