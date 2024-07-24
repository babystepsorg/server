"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.client = void 0;
const mongodb_1 = require("mongodb");
const config_1 = __importDefault(require("./config"));
exports.client = new mongodb_1.MongoClient(config_1.default.MONGODB_URI);
exports.db = exports.client.db();
//# sourceMappingURL=db.js.map