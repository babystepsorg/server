"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.incompleteOne = exports.completeOne = exports.updateOne = exports.createOne = exports.getAll = void 0;
const userTodo_1 = require("../../models/userTodo");
const mongodb_1 = require("mongodb");
const todo_model_1 = require("./todo.model");
const week_1 = require("../../utils/week");
// Todo need to show todos from previous weeks if they are not completed
const getAll = async (req, res, next) => {
    try {
        // const currentStage = req.user!.stage
        // const accountCreationData = req.user!.createdAt
        // let week = getCurrentWeek(currentStage, accountCreationData);
        // if (req.user!.consiveDate) {
        //   const cw = getCurrentWeekFromConsiveDate(req.user!.consiveDate, accountCreationData)
        //   week = cw.week
        // }
        // if (req.query.week) {
        //   week = parseInt(req.query.week)
        // }
        const reqWeek = req.query.week ? parseInt(req.query.week) : undefined;
        let { week } = await (0, week_1.getWeekFromUser)(req.user, reqWeek);
        const [adminTodos, userTodos, adminIncompletedTodos] = await Promise.all([
            todo_model_1.Todos.aggregate([
                {
                    $addFields: {
                        weeks: {
                            $map: {
                                input: "$week",
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
                        'week.title': week.toString(),
                    },
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
                        description: 1,
                        priority: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        admin: 1
                    }
                }
            ]).toArray(),
            userTodo_1.UserTodos.find({
                $or: [{ userId: req.user._id }, { userId: req.user.partnerId }],
                // completed: false,
            }).toArray(),
            todo_model_1.Todos.aggregate([
                {
                    $addFields: {
                        weeks: {
                            $map: {
                                input: "$week",
                                as: "id",
                                in: {
                                    $toObjectId: "$$id"
                                }
                            }
                        },
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
                                        title: { $lt: week.toString() }
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'userTodos',
                        let: { todoId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$adminTodo', '$$todoId'] },
                                            { $or: [
                                                    { $eq: ['$userId', req.user._id] },
                                                    { $eq: ['$userId', req.user.partnerId] }
                                                ] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'adminTodo',
                    },
                },
                {
                    $addFields: {
                        completed: {
                            $cond: {
                                if: { $eq: [{ $size: '$adminTodo' }, 0] },
                                then: false,
                                else: { $arrayElemAt: ['$adminTodo.completed', 0] },
                            },
                        },
                    },
                },
                {
                    $match: {
                        priority: { $in: ['2', '3'] }
                    }
                },
            ]).toArray()
        ]);
        const userTodosWithoutAdmin = userTodos.filter((todo) => todo.adminTodo === undefined);
        const userTodosWithAdmin = userTodos.filter((todo) => todo.adminTodo !== undefined).map(todo => {
            const userId = req.user._id;
            const me = userId.toString() === todo.userId.toString();
            return {
                ...todo,
                me
            };
        });
        for (const userAdminTodo of userTodosWithAdmin) {
            const adminTodo = adminTodos.find((todo) => todo._id.toString() === userAdminTodo.adminTodo.toString());
            if (adminTodo) {
                const { _id, ...rest } = userAdminTodo;
                const adminTodoIndex = adminTodos.indexOf(adminTodo);
                const userId = req.user._id;
                const me = userId.toString() === rest.userId.toString();
                const updatedTodo = {
                    ...adminTodo,
                    ...rest,
                    overdue: false,
                    me
                };
                adminTodos[adminTodoIndex] = updatedTodo;
            }
        }
        const adminUserInCompletedTodos = adminIncompletedTodos.map((todo) => {
            let weeksLessThanCurrentWeek = todo.week.filter((w) => parseInt(w.title) < week);
            if (week <= 4) {
                weeksLessThanCurrentWeek = todo.week.filter((w) => parseInt(w.title) >= 1 && parseInt(w.title) <= 4);
            }
            if (weeksLessThanCurrentWeek.length && todo.completed === false) {
                return {
                    _id: todo._id,
                    title: todo.title,
                    description: todo.description,
                    completed: todo.completed,
                    admin: true,
                    overdue: true
                };
            }
            return null;
        }).filter((todo) => todo !== null);
        const combinedTodos = [...adminTodos, ...userTodosWithoutAdmin, ...adminUserInCompletedTodos];
        const uniqueTodos = combinedTodos.reduce((unique, todo) => {
            return unique.some((t) => t.title === todo.title) ? unique : [...unique, todo];
        }, []);
        res.json(uniqueTodos);
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const createOne = async (req, res, next) => {
    try {
        const completionDate = req.body.completionDate;
        if (completionDate) {
            const date = new Date(completionDate);
            const hours = date.getHours();
            if (hours === 0) {
                date.setHours(18);
            }
            req.body.completionDate = date.toISOString();
        }
        const insertedTodo = await userTodo_1.UserTodos.insertOne({
            ...req.body,
            userId: req.user._id,
            completed: false,
        });
        if (!insertedTodo.acknowledged)
            throw new Error('Error inserting todo');
        res.status(201);
        res.json({
            _id: insertedTodo.insertedId,
            ...req.body,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.createOne = createOne;
async function updateOne(req, res, next) {
    try {
        const { admin, ...data } = req.body;
        if (admin) {
            // check if it already exist
            const adminTodo = await userTodo_1.UserTodos.findOne({
                adminTodo: new mongodb_1.ObjectId(req.params.id),
                $or: [{ userId: req.user._id }, { userId: req.user.partnerId }],
            });
            if (adminTodo) {
                const result = await userTodo_1.UserTodos.findOneAndUpdate({
                    adminTodo: new mongodb_1.ObjectId(req.params.id),
                    $or: [{ userId: req.user._id }, { userId: req.user.partnerId }],
                }, {
                    $set: {
                        completionDate: data.completionDate,
                        assignPartner: data?.assignPartner ?? false,
                        userPriority: data?.userPriority ?? 'normal',
                    },
                });
                if (result.ok) {
                    return res.json(result.value);
                }
                throw new Error('Something went wrong while updating todo.');
            }
            const result = await userTodo_1.UserTodos.insertOne({
                adminTodo: new mongodb_1.ObjectId(req.params.id),
                userId: req.user._id,
                completionDate: data.completionDate,
                assignPartner: data.assignPartner,
                userPriority: data.userPriority,
                completed: false,
            });
            if (!result.acknowledged)
                throw new Error('Error while updaing task');
            return res.json({
                _id: result.insertedId,
                ...data,
            });
        }
        const result = await userTodo_1.UserTodos.findOneAndUpdate({
            _id: new mongodb_1.ObjectId(req.params.id),
            $or: [{ userId: req.user._id }, { userId: req.user.partnerId }],
        }, {
            $set: data,
        }, {
            returnDocument: 'after',
        });
        if (!result.value) {
            res.status(404);
            throw new Error(`Todo with id "${req.params.id}" not found.`);
        }
        res.json(result.value);
    }
    catch (error) {
        next(error);
    }
}
exports.updateOne = updateOne;
async function completeOne(req, res, next) {
    try {
        if (req.body.admin) {
            const adminTodo = await userTodo_1.UserTodos.findOne({
                adminTodo: new mongodb_1.ObjectId(req.params.id),
                $or: [{ userId: req.user._id }, { userId: req.user.partnerId }]
            });
            if (adminTodo) {
                await userTodo_1.UserTodos.findOneAndUpdate({
                    adminTodo: new mongodb_1.ObjectId(req.params.id),
                    $or: [{ userId: req.user._id }, { userId: req.user.partnerId }],
                }, {
                    $set: {
                        completed: true,
                        completedOn: new Date().toISOString(),
                    },
                });
                return res.json({ message: 'Task completed sucessfully' });
            }
            const rs = await userTodo_1.UserTodos.insertOne({
                adminTodo: new mongodb_1.ObjectId(req.params.id),
                completed: true,
                completedOn: new Date().toISOString(),
                userId: req.user._id,
                userPriority: 'normal',
            });
            return res.json({ message: 'Task completed sucessfully' });
        }
        await userTodo_1.UserTodos.findOneAndUpdate({
            _id: new mongodb_1.ObjectId(req.params.id),
            $or: [{ userId: req.user._id }, { userId: req.user.partnerId }],
        }, {
            $set: {
                completed: true,
                completedOn: new Date().toISOString(),
            },
        });
        return res.json({ message: 'Task completed sucessfully' });
    }
    catch (error) {
        next(error);
    }
}
exports.completeOne = completeOne;
async function incompleteOne(req, res, next) {
    try {
        if (req.body.admin) {
            const result = await userTodo_1.UserTodos.findOneAndUpdate({
                adminTodo: new mongodb_1.ObjectId(req.params.id),
                $or: [{ userId: req.user._id }, { userId: req.user.partnerId }],
            }, {
                $set: {
                    completed: false,
                    completedOn: undefined,
                },
            });
            return res.json({ message: 'Task incompleted sucessfully' });
        }
        await userTodo_1.UserTodos.findOneAndUpdate({
            _id: new mongodb_1.ObjectId(req.params.id),
            $or: [{ userId: req.user._id }, { userId: req.user.partnerId }],
        }, {
            $set: {
                completed: false,
                completedOn: undefined,
            },
        });
        return res.json({ message: 'Task incompleted sucessfully' });
    }
    catch (error) {
        next(error);
    }
}
exports.incompleteOne = incompleteOne;
const deleteOne = async (req, res, next) => {
    try {
        const deletedTodo = await userTodo_1.UserTodos.deleteOne({
            _id: new mongodb_1.ObjectId(req.params.id)
        });
        if (!deletedTodo.acknowledged)
            throw new Error('Error deleting todo');
        res.status(200);
        res.json({
            sucess: true
        });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteOne = deleteOne;
//# sourceMappingURL=todo.handler.js.map