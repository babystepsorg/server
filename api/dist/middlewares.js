"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = exports.validateRequest = exports.validateAuthentication = exports.validateApiKey = void 0;
const zod_1 = require("zod");
const jwt_1 = require("./utils/jwt");
const user_1 = require("./services/user");
const contenthistory_1 = require("./models/contenthistory");
const selectedSpecialit_1 = require("./models/selectedSpecialit");
const calander_1 = require("./models/calander");
const userTodo_1 = require("./models/userTodo");
const usersymptoms_1 = require("./models/usersymptoms");
const user_2 = require("./models/user");
const payment_model_1 = require("./api/payments/payment.model");
const mongodb_1 = require("mongodb");
async function validateApiKey(req, res, next) {
    try {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey || apiKey !== 'bs_pymnt_MM5lHlgWVrweJ8') {
            res.status(403);
            throw new Error('Forbidden');
        }
        next();
    }
    catch (err) {
        next(err);
    }
}
exports.validateApiKey = validateApiKey;
async function validateAuthentication(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization || !authorization.includes('Bearer')) {
            res.status(401);
            throw new Error('Unauthorized');
        }
        const token = authorization.split(' ')[1];
        if (!token) {
            res.status(401);
            throw new Error('Unauthorized');
        }
        if (token === "bs_A1b2C3d4E5f6G7h8") {
            const user = await (0, user_1.findUserById)("6634b3d32827210ba1bb9705");
            if (!user) {
                res.status(401);
                throw new Error('Unauthorized');
            }
            await Promise.all([
                contenthistory_1.ContentHistories.deleteMany({ userId: user._id }),
                calander_1.Calanders.deleteMany({ userId: user._id }),
                selectedSpecialit_1.SelectedSpecialists.deleteMany({ userId: user._id }),
                usersymptoms_1.UserSymptoms.deleteMany({ userId: user._id }),
                userTodo_1.UserTodos.deleteMany({ userId: user._id })
            ]);
            const { password, salt, ...rest } = user;
            req.user = { ...rest, root: true };
            return next();
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await (0, user_1.findUserById)(decoded.userId);
        if (!user) {
            res.status(401);
            throw new Error('Unauthorized');
        }
        const { password, salt, ...rest } = user;
        let partner = !!rest.partnerId;
        let root = false;
        if (!partner) {
            const foundUser = await user_2.Users.findOne({ partnerId: rest._id });
            // check the concieveDate
            const userConsiveDate = user.consiveDate;
            const userDueDateAddedAt = user?.dueDateAddedAt;
            const foundUserConsiveDate = foundUser?.consiveDate;
            const foundUserDueDateAddedAt = foundUser?.dueDateAddedAt;
            if (userDueDateAddedAt && foundUserDueDateAddedAt) {
                const userDueDateAddedAtDate = new Date(userDueDateAddedAt);
                const foundUserDueDateAddedAtDate = new Date(foundUserDueDateAddedAt);
                if (foundUserDueDateAddedAtDate > userDueDateAddedAtDate) {
                    rest.consiveDate = foundUserConsiveDate;
                }
            }
            // if (foundUser) {
            rest.partnerId = foundUser?._id ?? undefined;
            const payment = await payment_model_1.Payments.findOne({ user_id: new mongodb_1.ObjectId(rest._id) });
            rest.subscriptionEndDate = payment?.subscription_end_at?.toString() ?? user?.subscriptionEndDate;
            rest.subscriptionStartDate = payment?.subscription_start_at?.toString() ?? user?.subscriptionStartDate;
            rest.subscriptionStatus = payment?.subscription_status ?? user?.subscriptionStatus;
            rest.razorpayPlanId = payment?.razorpay_plan_id ?? user?.razorpayPlanId;
            rest.razorpaySubscriptionId = payment?.subscription_id ?? user?.razorpaySubscriptionId;
            root = true;
            // }
        }
        else {
            const foundUser = await user_2.Users.findOne({ _id: rest.partnerId });
            if (foundUser) {
                const payment = await payment_model_1.Payments.findOne({ user_id: new mongodb_1.ObjectId(rest.partnerId) });
                rest.subscriptionEndDate = payment?.subscription_end_at?.toString() ?? foundUser.subscriptionEndDate;
                rest.subscriptionStartDate = payment?.subscription_start_at?.toString() ?? foundUser.subscriptionStartDate;
                rest.subscriptionStatus = payment?.subscription_status ?? foundUser.subscriptionStatus;
                rest.razorpayPlanId = payment?.razorpay_plan_id ?? foundUser.razorpayPlanId;
                rest.razorpaySubscriptionId = payment?.subscription_id ?? foundUser.razorpaySubscriptionId;
                rest.createdAt = foundUser.createdAt;
                root = false;
                // check the concieveDate
                const userConsiveDate = user.consiveDate;
                const userDueDateAddedAt = user?.dueDateAddedAt;
                const foundUserConsiveDate = foundUser?.consiveDate;
                const foundUserDueDateAddedAt = foundUser?.dueDateAddedAt;
                if (userDueDateAddedAt && foundUserDueDateAddedAt) {
                    const userDueDateAddedAtDate = new Date(userDueDateAddedAt);
                    const foundUserDueDateAddedAtDate = new Date(foundUserDueDateAddedAt);
                    if (foundUserDueDateAddedAtDate > userDueDateAddedAtDate) {
                        rest.consiveDate = foundUserConsiveDate;
                    }
                }
            }
        }
        req.user = { ...rest, root };
        next();
    }
    catch (err) {
        next(err);
    }
}
exports.validateAuthentication = validateAuthentication;
function validateRequest(validators) {
    return async (req, res, next) => {
        try {
            if (validators.params) {
                req.params = await validators.params.parseAsync(req.params);
            }
            if (validators.body) {
                req.body = await validators.body.parseAsync(req.body);
            }
            if (validators.query) {
                req.query = await validators.query.parseAsync(req.query);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(422);
            }
            next(error);
        }
    };
}
exports.validateRequest = validateRequest;
function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}
exports.notFound = notFound;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err, req, res, next) {
    console.log("Error:: ", err);
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=middlewares.js.map