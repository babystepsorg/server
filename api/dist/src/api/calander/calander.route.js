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
const CalanderHandler = __importStar(require("./calander.handler"));
const calander_1 = require("../../models/calander");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
router.get('/', middlewares_1.validateAuthentication, (0, middlewares_1.validateRequest)({
    query: zod_1.z.object({
        week: zod_1.z.string().optional()
    }),
}), CalanderHandler.getAll);
router.post('/', middlewares_1.validateAuthentication, (0, middlewares_1.validateRequest)({
    body: calander_1.Calander.omit({
        userId: true,
    }),
}), CalanderHandler.createOne);
router.post('/gr', middlewares_1.validateAuthentication, (0, middlewares_1.validateRequest)({
    body: calander_1.Calander.omit({
        userId: true
    }),
}), CalanderHandler.createOrUpdateGR);
router.get('/gr/:id', middlewares_1.validateAuthentication, CalanderHandler.getGentleReminderDoc);
router.patch('/:id', middlewares_1.validateAuthentication, (0, middlewares_1.validateRequest)({
    body: calander_1.Calander.omit({
        userId: true,
    }).extend({
        date: zod_1.z.string().datetime().optional(),
    }),
}), CalanderHandler.updateOne);
router.delete('/:id', middlewares_1.validateAuthentication, CalanderHandler.deleteOne);
exports.default = router;
//# sourceMappingURL=calander.route.js.map