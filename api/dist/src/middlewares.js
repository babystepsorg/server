"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = exports.validateRequest = exports.validateAuthentication = void 0;
const zod_1 = require("zod");
const jwt_1 = require("./utils/jwt");
const user_1 = require("./services/user");
async function validateAuthentication(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        console.log(authorization);
        if (!authorization || !authorization.includes('Bearer')) {
            res.status(401);
            throw new Error('Unauthorized');
        }
        const token = authorization.split(' ')[1];
        if (!token) {
            res.status(401);
            throw new Error('Unauthorized');
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await (0, user_1.findUserById)(decoded.userId);
        if (!user) {
            res.status(401);
            throw new Error('Unauthorized');
        }
        const { password, salt, ...rest } = user;
        req.user = rest;
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
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=middlewares.js.map