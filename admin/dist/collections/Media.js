"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var Media = {
    slug: 'media',
    upload: {
        staticDir: path_1.default.resolve(__dirname, '../../media'),
    },
    access: {
        create: function () { return true; },
        read: function () { return true; },
        update: function () { return true; },
        delete: function () { return true; },
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
        },
        {
            name: 'darkModeFallback',
            type: 'upload',
            relationTo: 'media',
            admin: {
                description: 'Choose an upload to render if the visitor is using dark mode.',
            },
        },
    ],
};
exports.default = Media;
