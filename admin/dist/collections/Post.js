"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var isAdmin_1 = require("../access/isAdmin");
var richText_1 = __importDefault(require("../fields/richText"));
var slug_1 = require("../fields/slug");
var Posts = {
    slug: 'posts',
    admin: {
        useAsTitle: 'title',
        // preview: (doc) => 'https://babysteps.world/testing/things',
        hideAPIURL: true,
    },
    versions: {
        drafts: true,
    },
    access: {
        create: isAdmin_1.isAdmin,
        read: function () { return true; },
        readVersions: isAdmin_1.isAdmin,
        update: isAdmin_1.isAdmin,
        delete: isAdmin_1.isAdmin,
    },
    //   hooks: {
    //     afterChange: [
    //       ({ req: { payload }, doc }) => {
    //         regeneratePage({
    //           payload,
    //           collection: 'posts',
    //           doc,
    //         })
    //       },
    //     ],
    //   },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        (0, richText_1.default)({
            name: 'body',
        }),
        // {
        //   name: 'content',
        //   type: 'blocks',
        //   blocks: [MediaBlock],
        //   required: true,
        // },
        (0, slug_1.slugField)(),
        // {
        //   name: 'author',
        //   type: 'relationship',
        //   relationTo: 'users',
        //   required: true,
        //   admin: {
        //     position: 'sidebar',
        //   },
        // },
        {
            name: 'publishedOn',
            type: 'date',
            required: true,
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                },
                position: 'sidebar',
            },
        },
    ],
};
exports.default = Posts;
