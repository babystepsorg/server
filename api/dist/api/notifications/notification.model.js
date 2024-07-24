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
exports.Notifications = exports.Notification = void 0;
const z = __importStar(require("zod"));
const db_1 = require("../../db");
exports.Notification = z.object({
    userId: z.custom(),
    type: z.enum(["email", "popup", "notification"]),
    status: z.enum(["pending", "sent", "failed"]),
    read: z.boolean().optional().default(false),
    readAt: z.string().datetime().optional(),
    payload: z.object({
        subject: z.string(),
        message: z.string(),
        action: z.enum(["link", "popup", "none"]),
        link: z.string().url().optional(),
        popupContent: z.string().optional(),
    }),
    createdAt: z.string().datetime().optional().default(new Date().toISOString()),
    updatedAt: z.string().datetime().optional().default(new Date().toISOString()),
});
exports.Notifications = db_1.db.collection("notifications");
//# sourceMappingURL=notification.model.js.map