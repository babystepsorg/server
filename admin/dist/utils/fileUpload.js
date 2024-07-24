"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var multer_s3_1 = __importDefault(require("multer-s3"));
var client_s3_1 = require("@aws-sdk/client-s3");
var path_1 = __importDefault(require("path"));
require('dotenv').config();
var s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
    region: 'ap-south-1', // this is the region that you select in AWS account
});
var s3Storage = (0, multer_s3_1.default)({
    s3: s3,
    bucket: 'babysteps-assets',
    metadata: function (req, file, cb) {
        cb(null, { fieldname: file.fieldname });
    },
    key: function (req, file, cb) {
        var fileName = Date.now() + '_' + file.fieldname + '_' + file.originalname;
        cb(null, fileName);
    },
});
// function to sanitize files and send error for unsupported files
function sanitizeFile(file, cb) {
    // Define the allowed extension
    var fileExts = ['.png', '.jpg', '.jpeg', '.pdf', '.docx', '.doc'];
    // Check allowed extensions
    var isAllowedExt = fileExts.includes(path_1.default.extname(file.originalname.toLowerCase()));
    // Mime type must be an image
    var isAllowedMimeType = file.mimetype.startsWith('image/') || file.mimetype.startsWith('application/');
    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true); // no errors
    }
    else {
        // pass error msg to callback, which can be displaye in frontend
        cb('Error: File type not allowed!');
    }
}
// our middleware
var uploadImage = (0, multer_1.default)({
    storage: s3Storage,
    fileFilter: function (req, file, callback) {
        sanitizeFile(file, callback);
    },
    limits: {
        fileSize: 1024 * 1024 * 2, // 2mb file size
    },
});
exports.default = uploadImage;
