"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var InfoComponent_1 = __importDefault(require("../components/InfoComponent"));
var Weeks = {
    slug: 'weeks',
    access: {
        create: function () { return true; },
        read: function () { return true; },
        update: function () { return true; },
        delete: function () { return true; },
    },
    admin: {
        defaultColumns: ['title', 'stage', 'createdAt'],
        useAsTitle: 'title',
        hideAPIURL: true,
        components: {
            views: {
                Edit: {
                    Default: {
                        Tab: {
                            label: "Edit"
                        }
                    },
                    Testing: {
                        Component: InfoComponent_1.default,
                        path: '/info',
                        Tab: {
                            label: "Info",
                            href: '/info'
                        }
                    }
                }
            }
        }
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            unique: true,
            index: true,
        },
        {
            name: 'stage',
            type: 'text',
        },
        {
            name: 'overview',
            type: 'text',
        },
        {
            name: 'message',
            type: 'text',
        },
        {
            label: 'Red Flag Symptoms',
            name: 'red_flag_symptoms',
            type: 'relationship',
            relationTo: 'symptoms',
            hasMany: true
        }
    ],
};
exports.default = Weeks;
