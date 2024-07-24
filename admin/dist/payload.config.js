"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("payload/config");
var path_1 = __importDefault(require("path"));
var richtext_slate_1 = require("@payloadcms/richtext-slate");
var db_mongodb_1 = require("@payloadcms/db-mongodb");
var bundler_webpack_1 = require("@payloadcms/bundler-webpack");
var TodoLists_1 = __importDefault(require("./collections/TodoLists"));
var Users_1 = __importDefault(require("./collections/Users"));
var GentleReminder_1 = __importDefault(require("./collections/GentleReminder"));
var Symptoms_1 = __importDefault(require("./collections/Symptoms"));
var Changes_1 = __importDefault(require("./collections/Changes"));
var Products_1 = __importDefault(require("./collections/Products"));
var Doctors_1 = __importDefault(require("./collections/Doctors"));
var Media_1 = __importDefault(require("./collections/Media"));
var Slider_1 = __importDefault(require("./collections/Slider"));
var Content_1 = __importDefault(require("./collections/Content"));
var Weeks_1 = __importDefault(require("./collections/Weeks"));
var Calender_1 = __importDefault(require("./collections/Calender"));
var plugin_cloud_storage_1 = require("@payloadcms/plugin-cloud-storage");
var s3_1 = require("@payloadcms/plugin-cloud-storage/s3");
var Careers_1 = __importDefault(require("./collections/Careers"));
var Subheading_1 = __importDefault(require("./globals/Subheading"));
var Tag_1 = __importDefault(require("./collections/Tag"));
var RecommendedProducts_1 = __importDefault(require("./collections/RecommendedProducts"));
var RecommendedSpecialists_1 = __importDefault(require("./collections/RecommendedSpecialists"));
var Feedback_1 = __importDefault(require("./collections/Feedback"));
var adapter = (0, s3_1.s3Adapter)({
    config: {
        credentials: {
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        },
        region: process.env.S3_REGION,
    },
    bucket: process.env.S3_BUCKET,
});
exports.default = (0, config_1.buildConfig)({
    collections: [
        Weeks_1.default,
        Slider_1.default,
        Calender_1.default,
        GentleReminder_1.default,
        Symptoms_1.default,
        Changes_1.default,
        Content_1.default,
        Products_1.default,
        Doctors_1.default,
        TodoLists_1.default,
        Careers_1.default,
        Tag_1.default,
        Media_1.default,
        Users_1.default,
        RecommendedProducts_1.default,
        RecommendedSpecialists_1.default,
        Feedback_1.default
    ],
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.MONGODB_URI,
        autoPluralization: false
    }),
    editor: (0, richtext_slate_1.slateEditor)({}),
    globals: [
        Subheading_1.default
    ],
    typescript: {
        outputFile: path_1.default.resolve(__dirname, 'payload-types.ts'),
    },
    graphQL: {
        schemaOutputFile: path_1.default.resolve(__dirname, 'generated-schema.graphql'),
    },
    upload: {
        limits: {
            fileSize: 100000000, // 10 MB, written in bytes
        }
    },
    plugins: [
        (0, plugin_cloud_storage_1.cloudStorage)({
            collections: {
                media: {
                    adapter: adapter,
                },
            },
        }),
    ],
    admin: {
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        user: Users_1.default.slug,
        webpack: function (config) {
            var _a;
            return (__assign(__assign({}, config), { resolve: __assign(__assign({}, config.resolve), { alias: __assign(__assign({}, (_a = config === null || config === void 0 ? void 0 : config.resolve) === null || _a === void 0 ? void 0 : _a.alias), { react: path_1.default.resolve(__dirname, '../node_modules/react'), 'react-dom': path_1.default.resolve(__dirname, '../node_modules/react-dom'), 'react-router-dom': path_1.default.resolve(__dirname, '../node_modules/react-router-dom') }) }) }));
        }
    },
});
