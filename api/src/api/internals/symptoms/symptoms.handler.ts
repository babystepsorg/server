import { Request, Response, NextFunction } from 'express'
import { Symptoms } from '../../../models/symptoms';
import { ObjectId } from 'mongodb';
import { UserSymptoms } from '../../../models/usersymptoms';

export async function getSymptomsOfWeek(
    req: Request<{}, {}, {}, { week: string, weekId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { week, weekId } = req.query
      const [symptoms, userSymptoms] = await Promise.all([
        Symptoms.aggregate([
            {
                $match: {
                    weeks: { $in: [new ObjectId(weekId)] }
                }
            }
        ]).toArray(),
        UserSymptoms.aggregate([
            {
              $match: {
                week
              }
            },
            {
              $lookup: {
                from: "symptoms",
                localField: "symptomId",
                foreignField: "_id",
                as: "symptom"
              }
            },
            {
              $unwind: "$symptom"
            }
          ]).toArray()
      ])
  
      const symptomsByWeeksAndUsers: {
        users: string[],
        symptom: string,
        slected: boolean,
        addeded: boolean
      }[] = []

      let userSymtpomsLeft = userSymptoms

      symptoms.forEach(symptom => {
        const symptomId = symptom._id.toString();
        const usersWithSymptom = userSymtpomsLeft.filter(userSymptom => userSymptom.symptomId.toString() === symptomId);
        const users = usersWithSymptom.map(userSymptom => userSymptom.userId.toString());

        userSymtpomsLeft = userSymtpomsLeft.filter(userSymptom => userSymptom.symptomId.toString() !== symptomId);
        
        const existingSymptom = symptomsByWeeksAndUsers.find(s => s.symptom === symptom.name);
        if (!existingSymptom) {
          symptomsByWeeksAndUsers.push({
            users: users,
            symptom: symptom.name,
            slected: true,
            addeded: false
          });
        }
      });

      userSymtpomsLeft.forEach(symptom => {
        const similarSymptoms = userSymtpomsLeft.filter(userSymptom => userSymptom.symptomId.toString() === symptom.symptomId.toString());
        const userIds = similarSymptoms.map(userSymptom => userSymptom.userId.toString());
        const existingSymptom = symptomsByWeeksAndUsers.find(s => s.symptom === symptom.name);
        if (!existingSymptom) {
          symptomsByWeeksAndUsers.push({
            users: userIds,
            symptom: symptom.name,
            slected: false,
            addeded: true
          });
        }
      })
  
      
      res.status(200)
      res.send(symptomsByWeeksAndUsers)
    } catch (err) {
      next(err)
    }
  }