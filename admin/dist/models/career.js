"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var careerSchema = new mongoose_1.Schema({
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    linkedin_url: {
        type: String,
        required: true,
    },
    portfolio_link: {
        type: String,
    },
    resume_link: {
        type: String,
        required: true,
    },
    cover_letter: {
        type: String,
    },
    job: {
        type: String,
        required: true,
    },
}, {
    strict: false,
    timestamps: true,
});
var Career = (0, mongoose_1.model)('careerApplication', careerSchema);
exports.default = Career;
