"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
exports.Users = {
    slug: 'admin_users',
    auth: true,
    admin: {
        useAsTitle: 'email',
    },
    access: {
        create: function () { return true; },
        read: function () { return true; },
        update: function () { return true; },
        delete: function () { return true; },
    },
    fields: [
        {
            type: 'row',
            fields: [
                {
                    name: 'firstName',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'lastName',
                    type: 'text',
                    required: true,
                },
            ],
        },
        {
            name: 'photo',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'roles',
            type: 'select',
            hasMany: true,
            defaultValue: ['public'],
            required: true,
            access: {
                read: function () { return true; },
                create: function () { return true; },
                update: function () { return true; },
            },
            options: ['admin', 'author', 'public'],
        },
    ],
};
exports.default = exports.Users;
