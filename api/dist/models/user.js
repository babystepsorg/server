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
exports.Users = exports.User = void 0;
const z = __importStar(require("zod"));
const db_1 = require("../db");
exports.User = z.object({
    name: z.string().nonempty('Name is required'),
    email: z.string().email().nonempty('Email is required'),
    password: z.string().nullable(),
    role: z.enum(['caregiver', 'nurturer']),
    stage: z.enum(['pre-conception', 'pregnancy', 'postpartum']),
    salt: z.string().nullable(),
    dob: z.string().datetime().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    partnerId: z.custom().optional(),
    referralId: z.string().optional(),
    subscriptionCode: z.string().optional(),
    referredBy: z.string().optional(),
    consiveDate: z.string().datetime().optional(),
    dueDateAddedAt: z.string().datetime().optional(),
    googleId: z.string().optional(),
    googleAccessToken: z.string().optional(),
    googleRefreshToken: z.string().optional(),
    avatarUrl: z.string().optional(),
    subscriptionStatus: z.enum(['active', 'inactive', 'cancelled', 'trail']).optional(),
    subscriptionStartDate: z.string().datetime().optional(),
    subscriptionEndDate: z.string().datetime().optional(),
    // subscriptionPlan: z.string().optional(),
    // razorpayCustomerId: z.string().optional(),
    razorpaySubscriptionId: z.string().optional(),
    razorpayPlanId: z.string().optional(),
    // verification
    verified: z.boolean().default(false),
    createdAt: z.string().datetime().default(new Date().toISOString()),
    updatedAt: z.string().datetime().default(new Date().toISOString()),
});
exports.Users = db_1.db.collection('users');
//# sourceMappingURL=user.js.map