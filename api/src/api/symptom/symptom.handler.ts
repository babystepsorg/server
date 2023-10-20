import { Request, Response, NextFunction } from "express";
import { SymptomWithId, Symptoms } from "../../models/symptoms";
import { getCurrentWeek, getCurrentWeekFromConsiveDate, getDaysOfWeekForWeek } from "../../utils/week";
import { UserSymptoms } from "../../models/usersymptoms";
import { ObjectId } from "mongodb";

export const addSymptom = async (
	req: Request<{}, {}, { symptomId: string }>,
	res: Response,
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

		const symptom = await UserSymptoms.insertOne({ symptomId: new ObjectId(req.body.symptomId), userId: req.user!._id, week })
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

		let [symptoms, usersymptoms] = await Promise.all([
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
						image: { $toObjectId: '$image' }
					}
				},
				{
					$lookup: {
						from: "media",
						localField: 'image',
						foreignField: '_id',
						pipeline: [
							{
									$limit: 1
							}
					],
						as: 'image',
					}
				},
				{
					$addFields: {
						highlight: false
					}
				},
				{
					$project: {
						_id: 1,
						name: 1,
						descriptions: 1,
						image: { $arrayElemAt: ['$image', 0] },
						highlight: 1
					}
				}
			]).toArray(),
			UserSymptoms.aggregate([
				{
					$match: {
						$or: [
							{ userId: req.user?._id },
							{ userId: req.user?.partnerId }
						],
						week
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
						name: { $arrayElemAt: ['$symptom.name', 0] },
						descriptions: { $arrayElemAt: ['$symptom.descriptions', 0] },
						image: { $arrayElemAt: ['$symptom.image', 0] },
					}
				},
				{
					$addFields: {
						highlight: true
					}
				},
				{
					$addFields: {
						image: { $toObjectId: '$image' }
					}
				},
				{
					$lookup: {
						from: "media",
						localField: 'image',
						foreignField: '_id',
						pipeline: [
							{
									$limit: 1
							}
					],
						as: 'image',
					}
				},
				{
					$project: {
						_id: 1,
						symptomId: 1,
						name: 1,
						descriptions: 1,
						image: { $arrayElemAt: ['$image', 0] },
						highlight: 1
					}
				}
			]).toArray()
		])

		symptoms = symptoms.map((symptom) => {
			return {
				...symptom,
				image: {
					...symptom.image,
					url: `https://api.babysteps.world/media/${symptom.image.filename}`
				}
			}
		})

		usersymptoms = usersymptoms.map((symptom) => {
			return {
				...symptom,
				image: {
					...symptom.image,
					url: `https://api.babysteps.world/media/${symptom.image.filename}`
				}
			}
		})

		const adminSymptoms = symptoms.map(symp => {
			const foundUserSymptom = usersymptoms.find(it => symp.name === it.name);
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