"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SibApiV3Sdk = __importStar(require("@sendinblue/client"));
const config_1 = __importDefault(require("../config"));
class NotificationService {
    apiInstance;
    sendSmtpEmail;
    constructor() {
        this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        this.apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, config_1.default.EMAIL_API_KEY);
        this.sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    }
    async sendTemplateEmail({ template = 'invite-partner', email, loginLink, username, }) {
        this.sendSmtpEmail.subject = `${username} is inviting you to be his partner`;
        this.sendSmtpEmail.templateId = 2;
        this.sendSmtpEmail.params = {
            USERNAME: username,
            LOGIN_URL: loginLink,
        };
        this.sendSmtpEmail.to = [
            {
                email,
            },
        ];
        this.sendSmtpEmail.sender = {
            email: 'noreply@babysteps.world',
            name: 'No Reply <BabySteps>',
        };
        try {
            const response = await this.apiInstance.sendTransacEmail(this.sendSmtpEmail);
            return response.body;
        }
        catch (err) {
            console.log(err);
            throw new Error(err?.message ?? 'Email sending error');
        }
    }
}
exports.default = NotificationService;
//# sourceMappingURL=notification.js.map