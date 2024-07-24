"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invitePartner = exports.updateOne = exports.findOne = exports.createOne = void 0;
const user_1 = require("../../models/user");
const mongodb_1 = require("mongodb");
const user_2 = require("../../services/user");
const jwt_1 = require("../../utils/jwt");
const config_1 = __importDefault(require("../../config"));
const notification_1 = __importDefault(require("../../services/notification"));
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
    try {
        const userId = req.params.id;
        const token = (0, jwt_1.generateToken)({ type: 'PARTNER', userId }, { expiresIn: '2hr' });
        const email = req.body.email;
        const loginLink = `${config_1.default.CLIENT_URL}/signup?token=${token}`;
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
// Add partner to a user
// There are only some items that are going to be different for both user
// (means that both user can see there things)
// But most of the things will be same, what one user adds will be seen by the other
//# sourceMappingURL=user.handlers.js.map