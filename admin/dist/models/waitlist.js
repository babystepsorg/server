"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var waitlistScheme = new mongoose_1.Schema({
    email: String,
}, {
    strict: false,
    timestamps: true,
});
var Waitlist = (0, mongoose_1.model)('waitlist', waitlistScheme);
exports.default = Waitlist;
