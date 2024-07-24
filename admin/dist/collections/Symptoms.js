"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Symptoms = {
    slug: 'symptoms',
    admin: {
        defaultColumns: ['name', 'week', 'createdAt'],
        useAsTitle: 'name',
    },
    access: {
        create: function () { return true; },
        read: function () { return true; },
        update: function () { return true; },
        delete: function () { return true; },
    },
    fields: [
        {
            name: 'name',
            type: 'text',
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
            type: "row",
            fields: [
                {
                    name: 'weeks',
                    type: 'relationship',
                    relationTo: 'weeks',
                    required: true,
                    hasMany: true,
                },
                {
                    label: 'Red Flag Weeks',
                    name: 'red_flag_weeks',
                    type: 'relationship',
                    relationTo: 'weeks',
                    hasMany: true
                }
            ]
        },
        {
            label: 'Tags',
            name: 'tags',
            type: 'relationship',
            relationTo: 'tags',
            hasMany: true,
            admin: {
                position: 'sidebar'
            }
        },
        {
            label: 'Content Tags',
            name: 'content_tags',
            type: 'relationship',
            relationTo: 'tags',
            hasMany: true,
            admin: {
                position: 'sidebar'
            }
        },
        {
            label: 'Product Tags',
            name: 'product_tags',
            type: 'relationship',
            relationTo: 'tags',
            hasMany: true,
            admin: {
                position: 'sidebar'
            }
        },
        {
            label: 'Specialist Tags',
            name: 'specialist_tags',
            type: 'relationship',
            relationTo: 'tags',
            hasMany: true,
            admin: {
                position: 'sidebar'
            }
        }
    ],
};
exports.default = Symptoms;
