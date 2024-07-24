"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserByEmail = exports.subscribeUser = exports.invitePartner = exports.updateOne = exports.findOne = exports.createOne = void 0;
const user_1 = require("../../models/user");
const mongodb_1 = require("mongodb");
const user_2 = require("../../services/user");
const jwt_1 = require("../../utils/jwt");
const config_1 = __importDefault(require("../../config"));
const notification_1 = __importDefault(require("../../services/notification"));
const contenthistory_1 = require("../../models/contenthistory");
const selectedSpecialit_1 = require("../../models/selectedSpecialit");
const calander_1 = require("../../models/calander");
const userTodo_1 = require("../../models/userTodo");
const usersymptoms_1 = require("../../models/usersymptoms");
async function createOne(req, res, next) {
    try {
        const user = await (0, user_2.createUser)(req.body);
        res.status(201);
        res.json(user);
    }
    catch (err) {
        next(err);
    }
}
exports.createOne = createOne;
async function findOne(req, res, next) {
    try {
        const result = await (0, user_2.findUserById)(req.params.id);
        if (!result) {
            res.status(404);
            throw new Error(`User with id "${req.params.id}" not found.`);
        }
        const { password, salt, ...rest } = result;
        res.json(rest);
    }
    catch (error) {
        next(error);
    }
}
exports.findOne = findOne;
async function updateOne(req, res, next) {
    if (req.body.consiveDate) {
        req.body.stage = "pregnancy";
        req.body.dueDateAddedAt = new Date().toISOString();
    }
    try {
        const result = await user_1.Users.findOneAndUpdate({
            _id: new mongodb_1.ObjectId(req.params.id),
        }, {
            $set: req.body,
        }, {
            returnDocument: 'after',
        });
        if (!result.value) {
            res.status(404);
            throw new Error(`User with id "${req.params.id}" not found.`);
        }
        const { password, salt, ...rest } = result.value;
        res.json(rest);
    }
    catch (error) {
        next(error);
    }
}
exports.updateOne = updateOne;
async function invitePartner(req, res, next) {
    const origin = req.headers.origin;
    const user = req.user;
    const role = user.role === "caregiver" ? "nurturer" : "caregiver";
    try {
        const userId = req.params.id;
        const token = (0, jwt_1.generateToken)({ type: 'PARTNER', userId }, { expiresIn: '2hr' });
        const email = req.body.email;
        const loginLink = `${origin ?? config_1.default.CLIENT_URL}/signup?token=${token}&email=${email}&stage=${user.stage}&role=${role}`;
        const notificationService = new notification_1.default();
        await notificationService.sendTemplateEmail({
            email,
            loginLink,
            username: req.user?.name,
        });
        res.status(200);
        res.json({
            message: 'Email sent to partner',
        });
    }
    catch (err) {
        next(err);
    }
}
exports.invitePartner = invitePartner;
async function subscribeUser(req, res, next) {
    try {
        const userId = req.params.id;
        const { subscriptionStatus, subscriptionStartDate, subscriptionEndDate, razorpayPlanId, razorpaySubscriptionId } = req.body;
        const result = await user_1.Users.findOneAndUpdate({ _id: new mongodb_1.ObjectId(userId) }, {
            $set: {
                subscriptionStartDate,
                subscriptionEndDate,
                subscriptionStatus,
                razorpaySubscriptionId,
                razorpayPlanId,
                updatedAt: new Date().toISOString()
            }
        }, { returnDocument: 'after' });
        if (!result.value) {
            res.status(404);
            throw new Error(`User with id "${userId}" not found.`);
        }
        res.status(200).json({
            message: 'Subscription details updated successfully.',
            user: result.value
        });
    }
    catch (error) {
        next(error);
    }
}
exports.subscribeUser = subscribeUser;
// Add partner to a user
// There are only some items that are going to be different for both user
// (means that both user can see there things)
// But most of the things will be same, what one user adds will be seen by the other
async function deleteUserByEmail(req, res, next) {
    try {
        const { email } = req.body;
        const user = await user_1.Users.findOne({ email });
        if (!user) {
            res.status(404);
            throw new Error(`User with email "${email}" not found.`);
        }
        // Delete associated content, specialists, symptoms, and calendar entries
        await Promise.all([
            contenthistory_1.ContentHistories.deleteMany({ userId: user._id }),
            calander_1.Calanders.deleteMany({ userId: user._id }),
            selectedSpecialit_1.SelectedSpecialists.deleteMany({ userId: user._id }),
            usersymptoms_1.UserSymptoms.deleteMany({ userId: user._id }),
            userTodo_1.UserTodos.deleteMany({ userId: user._id })
        ]);
        // Finally, delete the user
        await user_1.Users.deleteOne({ _id: user._id });
        res.status(200).json({
            message: 'User and all related data deleted successfully.'
        });
    }
    catch (error) {
        next(error);
    }
}
exports.deleteUserByEmail = deleteUserByEmail;
//# sourceMappingURL=user.handlers.js.map