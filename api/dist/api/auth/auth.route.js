"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const user_1 = require("../../models/user");
const AuthHandler = __importStar(require("./auth.handlers"));
const zod_1 = require("zod");
const router = (0, express_1.Router)();
router.post('/signup', (0, middlewares_1.validateRequest)({
    body: user_1.User.omit({ salt: true }).extend({
        token: zod_1.z.string().optional()
    }),
}), AuthHandler.signUp);
router.post('/login', (0, middlewares_1.validateRequest)({
    body: user_1.User.omit({
        role: true,
        stage: true,
        salt: true,
        name: true,
    }),
}), AuthHandler.logIn);
router.post('/refresh', 
// validateAuthentication,
(0, middlewares_1.validateRequest)({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().nonempty('Refresh token is required'),
    }),
}), AuthHandler.refreshToken);
router.get('/verify', (0, middlewares_1.validateRequest)({
    query: zod_1.z.object({
        token: zod_1.z.string().min(1, 'Token is required'),
        origin: zod_1.z.string().min(1, 'Origin is required')
    }),
}), AuthHandler.verifyAccount);
router.get('/google', AuthHandler.googleAuth);
router.get('/google/callback', AuthHandler.googleAuthCallback);
router.get('/google/calendar', 
// AuthHandler.googleCalandarAuthMiddleware,
AuthHandler.googleCalandarAuth);
router.get('/google/calendar/callback', AuthHandler.googleCalanderAuthCallback);
// router.get(
//   '/google/signup',
//   AuthHandler.googleAuthSignup
// )
// router.get(
//   '/google/signup/callback',
//   AuthHandler.googleAuthSignupCallback
// )
router.get('/me', middlewares_1.validateAuthentication, AuthHandler.me);
exports.default = router;
//# sourceMappingURL=auth.route.js.map