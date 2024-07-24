"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Changes = {
    slug: 'changes',
    admin: {
        defaultColumns: ['mother_description', 'week', 'createdAt'],
        useAsTitle: 'mother_description',
    },
    access: {
        create: function () { return true; },
        read: function () { return true; },
        update: function () { return true; },
        delete: function () { return true; },
    },
    fields: [
        {
            name: 'mother_description',
            label: 'Mother Description',
            type: 'text',
            required: true,
        },
        {
            name: 'baby_description',
            label: 'Baby Description',
            type: 'text',
            required: true,
        },
        {
            name: 'weeks',
            type: 'relationship',
            relationTo: 'weeks',
            required: true,
            hasMany: true,
        },
    ],
};
exports.default = Changes;
