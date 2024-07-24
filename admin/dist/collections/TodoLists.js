"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Todo = {
    slug: 'todos',
    admin: {
        defaultColumns: ['title', 'week', 'updatedAt'],
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
            name: 'description',
            type: 'text',
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'week',
                    type: 'relationship',
                    relationTo: 'weeks',
                    required: true,
                    hasMany: true,
                },
                {
                    name: 'priority',
                    type: 'select',
                    options: [
                        {
                            label: 'Normal',
                            value: '1',
                        },
                        {
                            label: 'Low',
                            value: '2',
                        },
                        {
                            label: 'Medium',
                            value: '3',
                        },
                        {
                            label: 'High',
                            value: '4',
                        },
                    ],
                    defaultValue: '1',
                },
            ],
        },
    ],
};
exports.default = Todo;
