import { NextFunction, Request, Response } from 'express'
import { Mentalhealths, Mentalhealth, MentalhealthWithId } from './mentalHealth.model'
import { UserWithId } from '../../models/user'
import { ObjectId } from 'mongodb'

export const saveMentalhealth = async (
  req: Request<{}, MentalhealthWithId, { emotion: string, description: string }>,
  res: Response<MentalhealthWithId>,
  next: NextFunction
) => {
  try {
    const userId = req.user!._id;
    const { emotion, description } = req.body
    const mentalHealth: Mentalhealth = {
      emotion,
      description,
      userId: new ObjectId(userId),
      createdAt: new Date().toISOString()
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
      const mentalHealth = await Mentalhealths.find({
        userId: new ObjectId(partnerId),
      }).sort({ createdAt: -1 }).limit(1)

      if (!mentalHealth) {
        res.status(404)
        throw new Error("Mental health not found")
      }
      res.status(200).json(mentalHealth[0])
    }

    throw new Error("Parnter not found")
  } catch (err) {
    next(err)
  }
}
