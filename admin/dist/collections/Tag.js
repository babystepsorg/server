"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tags = {
    slug: 'tags',
    admin: {
        defaultColumns: ['title', 'description', 'createdAt'],
        useAsTitle: 'title',
        hideAPIURL: true,
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
            required: true,
            index: true,
        },
        {
            name: 'description',
            type: 'text',
        },
        {
            name: 'type',
            type: 'select',
            options: [
                {
                    label: "Category",
                    value: "category"
                },
                {
                    label: "Symptom Category",
                    value: "symptom"
                },
                {
                    label: "Specialist Category",
                    value: "specialist"
                },
                {
                    label: "Products Category",
                    value: "product"
                },
                {
                    label: "Content Category",
                    value: "content"
                }
            ]
        },
    ],
};
exports.default = Tags;
