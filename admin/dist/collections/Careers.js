"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var richText_1 = __importDefault(require("../fields/richText"));
var slug_1 = require("../fields/slug");
var Careers = {
    slug: 'careers',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        create: function () { return true; },
        read: function () { return true; },
        update: function () { return true; },
        delete: function () { return true; },
    },
    fields: [
        {
            name: 'title',
            type: 'text',
        },
        {
            name: 'location',
            type: 'text',
        },
        {
            name: 'job_type',
            label: 'Job Type',
            type: 'text',
        },
        {
            name: 'category',
            type: 'text',
            admin: {
                position: 'sidebar',
            },
        },
        (0, richText_1.default)({ name: 'details' }),
        (0, slug_1.slugField)(),
    ],
};
exports.default = Careers;
