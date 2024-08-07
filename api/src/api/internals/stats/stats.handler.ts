import { Request, Response, NextFunction } from "express";
import { Trackings } from "../../tracking/tracking.model";
import { ActiveUsers } from '../../../models/activeUser'

export async function getScreenTimeData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const endDate = currentDate;

    const graphData = await Trackings.aggregate([
      {
        $match: {
          trackedAt: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$trackedAt" } },
          count: { $sum: 1 },
          duration: { $sum: "$duration" }
        }
      }
    ]).toArray();

    res.status(200).json({ graphData });
  } catch (error) {
    next(error);
  }
}

export async function getDailyActiveUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const currentDate = new Date();
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i, 0, 0, 0, 0);
      dates.push(date);
    }

    const activeUsers = await Promise.all(dates.map(async (date) => {
      const startDate = date;
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

      const users = await ActiveUsers.find({
        activityTimestamp: {
          $gte: startDate.toISOString(),
          $lt: endDate.toISOString()
        }
      }).toArray();

      return { date: date.toISOString().split('T')[0], count: users.length };
    }));

    res.status(200).json({ activeUsers });
  } catch (error) {
    next(error);
  }
}
