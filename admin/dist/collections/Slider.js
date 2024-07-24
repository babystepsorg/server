"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Slider = {
    slug: 'slider-images',
    admin: {
        defaultColumns: ['link'],
        useAsTitle: 'link',
    },
    access: {
        create: function () { return true; },
        read: function () { return true; },
        update: function () { return true; },
        delete: function () { return true; },
    },
    fields: [
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'link',
            label: 'Link',
            type: 'text',
        },
        {
            name: 'stage',
            type: 'select',
            hasMany: true,
            required: true,
            options: ['Preconception', 'Pregnancy', 'Postpartum'],
        },
    ],
};
exports.default = Slider;
