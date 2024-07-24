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
exports.Contents = exports.Content = void 0;
const z = __importStar(require("zod"));
const db_1 = require("../db");
exports.Content = z.object({
    title: z.string(),
    layout: z.enum(['video', 'post']),
    type: z.enum(['link']),
    video_url: z.string(),
    weeks: z.array(z.string()),
    roles: z.array(z.enum(['Father', 'Mother'])),
    body: z.any(),
    tags: z.array(z.custom()),
    createdAt: z.string().datetime().default(new Date().toISOString()),
    updatedAt: z.string().datetime().default(new Date().toISOString()),
});
exports.Contents = db_1.db.collection('contents');
//# sourceMappingURL=content.js.map