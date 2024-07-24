"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGentleReminderDoc = exports.createOrUpdateGR = exports.deleteOne = exports.updateOne = exports.createOne = exports.getAll = void 0;
const calander_1 = require("../../models/calander");
const userTodo_1 = require("../../models/userTodo");
const mongodb_1 = require("mongodb");
const week_1 = require("../../utils/week");
const planner_1 = require("../../models/planner");
const getAll = async (req, res, next) => {
    const userCreationDate = req.user.createdAt;
    const userConsiveDate = req.user.consiveDate;
    // const reqWeek = req.query.week ? parseInt(req.query.week) : undefined
    // let { week } = await getWeekFromUser(req.user!, reqWeek, true)
    let week = (0, week_1.getCurrentWeek)(req.user.stage, userCreationDate);
    let days = (0, week_1.getDaysOfWeekForWeek)({ weekNumber: week, createdAt: new Date(userCreationDate) });
    if (userConsiveDate) {
        const cw = (0, week_1.getCurrentWeekFromConsiveDate)(userConsiveDate, userCreationDate);
        week = cw.week;
        days = (0, week_1.getDaysOfWeekForWeek)({ weekNumber: week, consiveDate: cw.date });
    }
    if (req.query.week) {
        week = parseInt(req.query.week);
        if (userConsiveDate) {
            days = (0, week_1.getDaysOfWeekFromWeekAndConsiveDate)({ weekNumber: parseInt(req.query.week), consiveDate: userConsiveDate });
        }
        else {
            days = (0, week_1.getDaysOfWeekFromWeekAndConsiveDate)({ weekNumber: parseInt(req.query.week), createdAt: userCreationDate });
        }
    }
    try {
        // add the date directly from here
        const [plannerTodos, calanderTasks, userTodos] = await Promise.all([
            planner_1.Planners.aggregate([
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
                                        $and: [
                                            { title: { $lt: (week + 4).toString() } },
                                            { title: { $gt: week.toString() } }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        admin: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        roles: 1,
                        priority: 1,
                        day: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        admin: 1,
                        color: 1,
                        week: 1
                    }
                }
            ]).toArray(),
            calander_1.Calanders.aggregate([
                {
                    $set: {
                        gentleReminderId: {
                            $toObjectId: "$gentleReminderId"
                        }
                    }
                },
                {
                    $match: {
                        $or: [
                            {
                                userId: req.user._id,
                            },
                            {
                                userId: req.user.partnerId,
                            },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'genetle-reminders',
                        localField: 'gentleReminderId',
                        foreignField: '_id',
                        as: 'gentlereminder'
                    }
                }
            ]).toArray(),
            userTodo_1.UserTodos.aggregate([
                {
                    $match: {
                        $or: [
                            {
                                userId: req.user._id,
                            },
                            {
                                userId: req.user.partnerId,
                            },
                        ],
                        completionDate: {
                            $exists: true,
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'todos',
                        localField: 'adminTodo',
                        foreignField: '_id',
                        as: 'adminTodo',
                    }
                },
                {
                    $set: {
                        adminTodo: {
                            $cond: {
                                if: { $gt: [{ $size: '$adminTodo' }, 0] },
                                then: { $arrayElemAt: ['$adminTodo', 0] },
                                else: null, // If adminTodo array is empty, set adminTodo to null
                            },
                        },
                        title: {
                            $cond: [
                                { $gt: [{ $size: '$adminTodo' }, 0] },
                                { $arrayElemAt: ['$adminTodo.title', 0] },
                                '$title' // Use the default title value (change 'defaultTitle' to your preferred default)
                            ],
                        },
                        description: {
                            $cond: [
                                { $gt: [{ $size: '$adminTodo' }, 0] },
                                { $arrayElemAt: ['$adminTodo.description', 0] },
                                '$description' // Use the default description value (change 'defaultDescription' to your preferred default)
                            ],
                        },
                    },
                },
                {
                    $project: {
                        adminTodo: 0
                    }
                }
            ]).toArray()
        ]);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        // Map the tasks to their respective days
        const result = days.map((day, index) => {
            const tasks = [];
            day.setHours(0, 0, 0, 0);
            let currentWeek = Math.floor(index / 7);
            currentWeek += week;
            const todosForCurrentWeek = plannerTodos.filter(todo => todo.week.some((w) => w.title === currentWeek.toString()));
            if (currentWeek === week) {
                tasks.push(...todosForCurrentWeek.filter(todo => todo.day === (index + 1).toString()));
            }
            else {
                const weekMoreThanCurrent = currentWeek - week;
                const dayForWeek = (index + 1) - (weekMoreThanCurrent * 7);
                tasks.push(...todosForCurrentWeek.filter(todo => {
                    const day = todo.day;
                    return day === dayForWeek.toString();
                }));
            }
            let foundTasks = userTodos.filter((it) => {
                let td = it.date;
                if (it.completionDate) {
                    td = it.completionDate;
                }
                const taskDate = new Date(td);
                taskDate.setHours(0, 0, 0, 0);
                return taskDate.getTime() == day.getTime();
            });
            tasks.push(...foundTasks);
            foundTasks = calanderTasks.filter((it) => {
                let td = it.date;
                if (it.completionDate) {
                    td = it.completionDate;
                }
                const taskDate = new Date(td);
                taskDate.setHours(0, 0, 0, 0);
                return taskDate.getTime() == day.getTime();
            });
            tasks.push(...foundTasks);
            const currentDay = day.toLocaleDateString('en-IN', { weekday: 'long' });
            foundTasks = calanderTasks.filter((it) => {
                if (it.gentleReminderId) {
                    const repeat = it.repeat;
                    if (repeat && repeat.includes(currentDay.toLowerCase())) {
                        return true;
                    }
                    ;
                    return false;
                }
                return false;
            });
            tasks.push(...foundTasks);
            const alternate = ((Math.floor((index) / 7) % 2) === 0) ? true : false;
            day.setHours(0, 0, 0, 0);
            return {
                day,
                tasks,
                alternate
            };
        });
        let data = result.filter(it => it.day.getTime() >= currentDate.getTime());
        if (req.query.week) {
            data = result;
        }
        res.json({
            data
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const createOne = async (req, res, next) => {
    try {
        const result = await calander_1.Calanders.insertOne({ ...req.body, userId: req.user._id });
        if (!result.acknowledged) {
            throw new Error('Error while insert Calander event');
        }
        res.status(201);
        res.json({
            ...req.body,
            _id: result.insertedId,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createOne = createOne;
const updateOne = async (req, res, next) => {
    try {
        const result = await calander_1.Calanders.findOneAndUpdate({ _id: new mongodb_1.ObjectId(req.params.id) }, { $set: req.body }, { returnDocument: 'after' });
        if (!result.ok) {
            throw new Error('Error while updating Calander event');
        }
        res.json(result.value);
    }
    catch (error) {
        next(error);
    }
};
exports.updateOne = updateOne;
const deleteOne = async (req, res, next) => {
    try {
        const calanderItem = await calander_1.Calanders.findOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        if (calanderItem) {
            const deletedItem = await calander_1.Calanders.deleteOne({
                _id: new mongodb_1.ObjectId(req.params.id),
            });
            if (deletedItem.acknowledged) {
                res.status(200);
                return res.json({ success: true });
            }
        }
        const todoItem = await userTodo_1.UserTodos.findOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        if (todoItem) {
            const updatedItem = await userTodo_1.UserTodos.findOneAndUpdate({
                _id: new mongodb_1.ObjectId(req.params.id)
            }, {
                $unset: {
                    completionDate: 1
                }
            });
            if (updatedItem.ok) {
                res.status(200);
                return res.json({ success: true });
            }
        }
        res.status(400);
        return res.json({ message: "Something went wrong" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteOne = deleteOne;
const createOrUpdateGR = async (req, res, next) => {
    try {
        const gentleReminderId = new mongodb_1.ObjectId(req.body.gentleReminderId);
        req.body.gentleReminderId = gentleReminderId;
        const gr = await calander_1.Calanders.findOneAndUpdate({ gentleReminderId, userId: req.user._id }, { $set: { ...req.body } }, { upsert: true });
        if (!gr.ok) {
            throw new Error('Something went wrong.');
        }
        res.status(200);
        return res.json({
            ...req.body,
            _id: gr.value._id
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createOrUpdateGR = createOrUpdateGR;
const getGentleReminderDoc = async (req, res, next) => {
    try {
        const gentleReminder = await calander_1.Calanders.findOne({ gentleReminderId: new mongodb_1.ObjectId(req.params.id), userId: req.user._id });
        if (!gentleReminder) {
            throw new Error('Error while getting Gentle Reminder');
        }
        res.status(200);
        res.json(gentleReminder);
    }
    catch (error) {
        next(error);
    }
};
exports.getGentleReminderDoc = getGentleReminderDoc;
//# sourceMappingURL=calander.handler.js.map