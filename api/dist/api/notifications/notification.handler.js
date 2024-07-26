"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllNotifications = void 0;
const notification_model_1 = require("./notification.model");
const getAllNotifications = async (req, res, next) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const notifications = await notification_model_1.Notifications.find({
            userId: req.user._id,
            status: "sent",
            createdAt: { $lte: new Date().toISOString() }
        })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();
        const totalDocs = await notification_model_1.Notifications.countDocuments({
            userId: req.user._id,
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
        res.status(200);
        res.send(paginatedResponse);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllNotifications = getAllNotifications;
//# sourceMappingURL=notification.handler.js.map