"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaBlock = void 0;
var blockFields_1 = require("../../fields/blockFields");
exports.MediaBlock = {
    slug: 'mediaBlock',
    fields: [
        (0, blockFields_1.blockFields)({
            name: 'mediaBlockFields',
            fields: [
                {
                    name: 'position',
                    type: 'select',
                    defaultValue: 'default',
                    options: [
                        {
                            label: 'Default',
                            value: 'default',
                        },
                        {
                            label: 'Wide',
                            value: 'wide',
                        },
                    ],
                },
                {
                    name: 'media',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
                {
                    name: 'caption',
                    type: 'richText'
                },
            ],
        }),
    ],
};
