"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RecommendedProducts = {
    slug: 'recommended-products',
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
            name: 'brand',
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
exports.default = RecommendedProducts;
