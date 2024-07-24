"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var richText_1 = __importDefault(require("../fields/richText"));
var addReferralId = function (_a) {
    var data = _a.data, req = _a.req, operation = _a.operation;
    return __awaiter(void 0, void 0, void 0, function () {
        var name_1, referralId;
        return __generator(this, function (_b) {
            if (operation === 'create' || operation === 'update') {
                name_1 = data.name.replace(/dr/i, "").replace(/\./g, "").replace(/\s/g, "").toUpperCase();
                referralId = name_1;
                data.referralId = referralId;
            }
            return [2 /*return*/, data];
        });
    });
};
var Doctors = {
    slug: 'doctors',
    admin: {
        defaultColumns: ['name', 'profession', 'createdAt'],
        useAsTitle: 'name',
    },
    access: {
        create: function () { return true; },
        read: function () { return true; },
        update: function () { return true; },
        delete: function () { return true; },
    },
    hooks: {
        beforeChange: [addReferralId]
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'profession',
            type: 'text',
            required: true,
        },
        (0, richText_1.default)({ label: 'description' }),
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: false,
        },
        {
            name: 'location',
            type: 'text',
        },
        {
            name: 'doctor_tags',
            label: "Doctor Tags",
            type: 'select',
            options: [
                {
                    label: "Judgment Free",
                    value: "judgment-free",
                },
                {
                    label: "Sex Positive",
                    value: "sex-positive",
                },
                {
                    label: "Queer Friendly",
                    value: "queer-friendly",
                },
                {
                    label: "Safe Space",
                    value: "safe-space",
                },
                {
                    label: "Reassuring",
                    value: "reassuring",
                },
                {
                    label: "Good Listner",
                    value: "good-listener",
                }
            ],
            hasMany: true,
        },
        {
            name: 'tags',
            type: 'relationship',
            relationTo: 'tags',
            hasMany: true,
            admin: {
                position: 'sidebar'
            }
        },
        {
            label: 'Symptom Tags',
            name: 'symptom_tags',
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
            name: 'phone',
            type: 'text',
        },
        {
            name: 'social_links',
            label: 'Social Links',
            type: 'array',
            fields: [
                {
                    name: 'platform',
                    type: 'select',
                    options: [
                        {
                            label: 'Facebook',
                            value: 'facebook',
                        },
                        {
                            label: 'Twitter',
                            value: 'twitter',
                        },
                        {
                            label: 'LinkedIn',
                            value: 'linkedin',
                        },
                        {
                            label: 'WhatsApp',
                            value: 'whatsapp'
                        },
                        {
                            label: 'Website',
                            value: 'web'
                        },
                        {
                            label: 'Instagram',
                            value: 'instagram'
                        },
                        {
                            label: "YouTube",
                            value: 'youtube'
                        }
                    ],
                },
                {
                    name: 'link',
                    type: 'text',
                },
            ],
        },
        {
            name: 'referralId',
            type: 'text',
            admin: {
                readOnly: true
            }
        },
    ],
};
exports.default = Doctors;
