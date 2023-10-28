import { Request, Response, NextFunction } from "express";
import { SymptomWithId, Symptoms } from "../../models/symptoms";
import { getCurrentWeek, getCurrentWeekFromConsiveDate, getDaysOfWeekForWeek, getWeekFromUser } from "../../utils/week";
import { UserSymptoms } from "../../models/usersymptoms";
import { ObjectId } from "mongodb";

export const addSymptom = async (
	req: Request<{}, {}, { symptomId: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		// const userCreationDate = req.user!.createdAt
		// const userConsiveDate = req.user!.consiveDate

		// let week = getCurrentWeek(req.user!.stage, userCreationDate)
		// if (userConsiveDate) {
		// 	const cw  = getCurrentWeekFromConsiveDate(userConsiveDate, userCreationDate)
		// 	week = cw.week
		// }

		const { week } = await getWeekFromUser(req.user!)

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
		// const userCreationDate = req.user!.createdAt
		// const userConsiveDate = req.user!.consiveDate

		// let week = getCurrentWeek(req.user!.stage, userCreationDate)
		// if (userConsiveDate) {
		// 	const cw  = getCurrentWeekFromConsiveDate(userConsiveDate, userCreationDate)
		// 	week = cw.week
		// }
		// if (req.query.week) {
		// 	week = parseInt(req.query.week)
		// }

		const reqWeek = req.query.week ? parseInt(req.query.week) : undefined
		let { week } = await getWeekFromUser(req.user!, reqWeek)

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
					$addFields: {
						'week': { $toString: '$week' }
					}
				},
				{
					$lookup: {
						from: 'weeks',
						localField: 'week',
						foreignField: 'title',
						as: 'week',
					},	
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
						week: 1,
						red_flag_weeks: { $arrayElemAt: ['$symptom.red_flag_weeks' , 0]}
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
					$addFields: {
						red_flag_weeks: {
							$map: {
								input: "$red_flag_weeks",
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
						localField: 'red_flag_weeks',
						foreignField: '_id',
						as: 'red_flag_weeks',
						pipeline: [
							{
								$project: {
									title: 1
								}
							}
						]
					},
				},
				{
					$project: {
						_id: 1,
						symptomId: 1,
						name: 1,
						descriptions: 1,
						image: { $arrayElemAt: ['$image', 0] },
						highlight: 1,
						week: 1,
						red_flag_weeks: 1
					}
				}
			]).toArray()
		])

		symptoms = symptoms.map((symptom) => {
			return {
				...symptom,
				red_flag: false,
				image: {
					...symptom.image,
					url: `https://api.babysteps.world/media/${symptom.image.filename}`
				}
			}
		})

		usersymptoms = usersymptoms.map((symptom) => {
			const red_flag_symptoms: Array<any> = symptom.week?.length ? (symptom.week[0]?.red_flag_symptoms ?? []) : []
	
			let red_flag = false;
			if (symptom.red_flag_weeks) {
				red_flag = !!symptom.red_flag_weeks.find((it: any) => it.title === week.toString())
			} else if (red_flag_symptoms.length) {
				red_flag = !!red_flag_symptoms.find((id: string) => id === symptom.symptomId.toString())
			}

			const { week: symptomWeek, red_flag_weeks, ...rest } = symptom;

			return {
				...rest,
				red_flag,
				image: {
					...symptom.image,
					url: `https://api.babysteps.world/media/${symptom?.image?.filename}`
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