import { Request, Response, NextFunction } from "express";
import { SymptomWithId, Symptoms } from "../../models/symptoms";
import { getCurrentWeek, getCurrentWeekFromConsiveDate } from "../../utils/week";
import { UserSymptoms } from "../../models/usersymptoms";
import { ObjectId } from "mongodb";

export const addSymptom = async (
	req: Request<{}, {}, { symptomId: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const symptom = await UserSymptoms.insertOne({ symptomId: new ObjectId(req.body.symptomId), userId: req.user!._id })
		if (!symptom.acknowledged) {
			throw new Error('Error while add the symptom')
		}
		res.status(201)
		res.send({
			_id: symptom.insertedId
		})
	} catch (err) {
		next(err)
	}
}

export const getSymptoms = async (
	req: Request<{}, Array<SymptomWithId>, {}, { week?: string, role: string }>,
	res: Response<Array<SymptomWithId>>,
	next: NextFunction
) => {
	try {
		const userCreationDate = req.user!.createdAt
		const userConsiveDate = req.user!.consiveDate

		let week = getCurrentWeek(req.user!.stage, userCreationDate)
		if (userConsiveDate) {
			const cw  = getCurrentWeekFromConsiveDate(userConsiveDate, userCreationDate)
			week = cw.week
		}
		if (req.query.week) {
			week = parseInt(req.query.week)
		}

		const [symptoms, usersymptoms] = await Promise.all([
			Symptoms.aggregate([
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
						week: {
							$all: [
									{
										$elemMatch: {
												title: { $eq: week.toString() }
										}
									}
							]
						},
						// roles: {
						// 	$in: [req.query.role]
						// }
					}
				},
				{
					$addFields: {
						highlight: false
					}
				}
			]).toArray(),
			UserSymptoms.aggregate([
				{
					$match: {
						$or: [
							{ userId: req.user?._id },
							{ userId: req.user?.partnerId }
						]
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
						name: '$symptom.name',
						description: '$symptom.description',
						image: '$symptom.image'
					}
				},
				{
					$addFields: {
						highlight: true
					}
				}
			]).toArray()
		])

		const adminSymptoms = symptoms.map(symp => {
			const foundUserSymptom = usersymptoms.find(it => it.symptomId === symp._id);
			if (foundUserSymptom) {
				return null;
			}
			return symp;
		}).filter(it => it !== null)


		res.status(200)
		res.send([...usersymptoms, ...adminSymptoms] as Array<SymptomWithId>);

	} catch (err) {
			next(err)
	}
}