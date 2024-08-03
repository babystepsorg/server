import { NextFunction, Request, Response } from 'express'
import { Mentalhealths, Mentalhealth, MentalhealthWithId } from './mentalHealth.model'
import { UserWithId } from '../../models/user'
import { ObjectId } from 'mongodb'
import { getWeekFromUser } from '../../utils/week'

export const saveMentalhealth = async (
  req: Request<{}, MentalhealthWithId, { emotion: string, description: string }>,
  res: Response<MentalhealthWithId>,
  next: NextFunction
) => {
  try {
    const { week } = await getWeekFromUser(req.user!)
    const userId = req.user!._id;
    const { emotion, description } = req.body
    const mentalHealth: Mentalhealth = {
      emotion,
      description,
      userId: new ObjectId(userId),
      week: week.toString(),
      checkedByPartner: false,
      createdAt: new Date().toISOString(),
    }
    const result = await Mentalhealths.insertOne(mentalHealth)
    if (!result.acknowledged) {
      throw new Error("Error inserting Mentalhealth")
    }
    res.status(201).json({
      _id: result.insertedId,
      ...mentalHealth
    })
  } catch (err) {
    next(err)
  }
}

export const getPartnerInfo = async (
  req: Request,
  res: Response<MentalhealthWithId>,
  next: NextFunction
) => {
  try {
    const partnerId = req.user!.partnerId

    if (partnerId) {
      const updateResult = await Mentalhealths.findOneAndUpdate(
        { userId: new ObjectId(partnerId) },
        { $set: { checkedByPartner: true } },
        { returnDocument: "after" }
      );

      if (!updateResult.value) {
        res.status(404)
        throw new Error("Mental health not found")
      }
      
      res.status(200).json(updateResult.value)
    }

    throw new Error("Parnter not found")
  } catch (err) {
    next(err)
  }
}
