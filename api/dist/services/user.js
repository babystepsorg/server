"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = exports.findUserById = exports.createUser = exports.comparePassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_1 = require("mongodb");
const user_1 = require("../models/user");
const SALT_ROUNDS = 10;
const hashPassword = async (password, options) => {
    try {
        const salt = await bcrypt_1.default.genSalt(options?.rounds || SALT_ROUNDS);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        return { salt, hashedPassword };
    }
    catch (err) {
        throw new Error('Error while hashing password.');
    }
};
const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt_1.default.compare(password, hashedPassword);
        return isMatch;
    }
    catch (err) {
        throw new Error('Error while comparing password.');
    }
};
exports.comparePassword = comparePassword;
const createUser = async (userBody) => {
    try {
        const { password, ...rest } = userBody;
        const { salt, hashedPassword } = await hashPassword(password);
        const insertResult = await user_1.Users.insertOne({
            ...rest,
            password: hashedPassword,
            salt,
        });
        if (!insertResult.acknowledged)
            throw new Error('Error inserting user.');
        return {
            _id: insertResult.insertedId,
            ...rest,
        };
    }
    catch (err) {
        throw new Error(err?.message || 'Error while creating user');
    }
};
exports.createUser = createUser;
const findUserById = async (id) => {
    return user_1.Users.findOne({
        _id: new mongodb_1.ObjectId(id),
    });
};
exports.findUserById = findUserById;
const findUserByEmail = async (email) => {
    return user_1.Users.findOne({
        email,
    });
};
exports.findUserByEmail = findUserByEmail;
//# sourceMappingURL=user.js.map