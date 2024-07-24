"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var sendMail = function (subject, body) {
    var transporter = nodemailer_1.default.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
            user: 'tech@babysteps.world',
            pass: 'Dx2ipp99mScm',
        },
    });
    var mailOptions = {
        from: 'Tech BabySteps <tech@babysteps.world>',
        to: 'careers@babysteps.world',
        subject: subject,
        html: body,
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(info);
    });
};
exports.sendMail = sendMail;
