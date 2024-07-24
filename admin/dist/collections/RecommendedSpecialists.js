"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RecommendedSpecialists = {
    slug: 'recommended-specialists',
    access: {
        read: function () { return true; },
        create: function () { return true; },
    },
    fields: [
        {
            type: 'text',
            name: 'name',
            admin: {
                readOnly: true
            }
        },
        {
            type: 'text',
            name: 'expertise',
            admin: {
                readOnly: true
            }
        },
        {
            type: 'text',
            name: 'contact',
            admin: {
                readOnly: true
            }
        },
        {
            type: 'text',
            name: 'user_id',
            label: "User ID",
            admin: {
                readOnly: true
            }
        }
    ]
};
exports.default = RecommendedSpecialists;
