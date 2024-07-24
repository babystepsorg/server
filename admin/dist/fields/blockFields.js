"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockFields = void 0;
var deepMerge_1 = __importDefault(require("../utils/deepMerge"));
var blockFields = function (_a) {
    var name = _a.name, fields = _a.fields, overrides = _a.overrides;
    return (0, deepMerge_1.default)({
        name: name,
        label: false,
        type: 'group',
        admin: {
            hideGutter: true,
            style: {
                margin: 0,
                padding: 0,
            },
        },
        fields: fields,
    }, overrides);
};
exports.blockFields = blockFields;
