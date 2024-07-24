"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_1 = __importDefault(require("./plugin"));
var Element_1 = __importDefault(require("./Element"));
var Button_1 = __importDefault(require("./Button"));
exports.default = {
    name: 'video',
    Button: Button_1.default,
    Element: Element_1.default,
    plugins: [plugin_1.default],
};
