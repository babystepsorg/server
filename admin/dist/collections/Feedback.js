"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Feedback = {
    slug: 'feedbacks',
    admin: {
        useAsTitle: 'type',
    },
    access: {
        create: function () { return true; },
        read: function () { return true; },
        update: function () { return true; },
        delete: function () { return true; },
    },
    fields: [
        {
            name: 'type',
            type: 'select',
            options: [
                {
                    value: 'bugs',
                    label: 'Bugs'
                },
                {
                    value: 'ui',
                    label: "UI"
                },
                {
                    value: 'incorrect-information',
                    label: "Incorrect Information",
                }
            ],
            admin: {
                readOnly: true
            }
        },
        {
            name: 'location',
            type: 'select',
            options: [
                {
                    value: 'dashboard',
                    label: 'Dashboard'
                },
                {
                    value: 'checklist',
                    label: "Checklist"
                },
                {
                    value: 'learning-lounge',
                    label: "Learning Lounge",
                },
                {
                    value: 'shoppe',
                    label: "Shoppe"
                },
                {
                    value: 'specialists-hub',
                    label: "Specialists Hub"
                }
            ],
            admin: {
                readOnly: true
            }
        },
        {
            name: 'information',
            type: "textarea",
            admin: {
                readOnly: true
            }
        }
    ],
};
exports.default = Feedback;
