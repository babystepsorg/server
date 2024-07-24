"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GentleReminder = {
    slug: 'genetle-reminders',
    admin: {
        defaultColumns: ['title', 'week', 'createdAt'],
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
            required: true,
        },
        {
            name: 'descriptions',
            type: 'text',
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'edit',
            type: 'checkbox',
            defaultValue: false,
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'weeks',
                    type: 'relationship',
                    relationTo: 'weeks',
                    hasMany: true,
                    required: true,
                },
                {
                    name: 'roles',
                    type: 'select',
                    hasMany: true,
                    required: true,
                    options: ['Mother', 'Father'],
                },
            ],
        },
    ],
};
exports.default = GentleReminder;
