import * as SibApiV3Sdk from '@sendinblue/client'
import axios from "axios";

import config from '../config'

type SendTemplate = {
  template?: 'invite-partner' | 'signup' | 'subscription.purchase'
  username: string
  loginLink: string
  email: string
  params?: Record<string, string>
}

class NotificationService {
  private apiInstance: SibApiV3Sdk.TransactionalEmailsApi
  private sendSmtpEmail: SibApiV3Sdk.SendSmtpEmail

  constructor() {
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
    this.apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      config.EMAIL_API_KEY!
    )
    this.sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()
  }

  async sendTemplateEmail({
    template = 'invite-partner',
    email,
    loginLink,
    username,
    params
  }: SendTemplate) {
    const subject = template === "invite-partner" ? `${username} is inviting you to be his partner` : template === "signup" ? "Welcome to BabySteps: Your Journey Begins Now" : `${username} please verify your account`
    this.sendSmtpEmail.subject = subject
    this.sendSmtpEmail.templateId = template === "signup" ? 1 : template === "subscription.purchase" ? 10 : 2
    this.sendSmtpEmail.params = params ? params : {
      USERNAME: username,
      LOGIN_URL: loginLink,
    }
    this.sendSmtpEmail.to = [
      {
        email,
      },
    ]
    this.sendSmtpEmail.sender = {
      email: 'info@babysteps.world',
      name: 'Info <BabySteps>',
    }

    try {
      const response = await this.apiInstance.sendTransacEmail(this.sendSmtpEmail)
      console.log("Body:: ", response.body)
      console.log("REs:: ", response.response)
      return response.body
    } catch (err: any) {
      console.log(err)
      throw new Error(err?.message ?? 'Email sending error')
    }
  }

  async sendEmailWithFetch({
    template = 'invite-partner',
    email,
    loginLink,
    username,
    params
  }: SendTemplate) {
    const subject = template === "invite-partner" ? `${username} is inviting you to be his partner` : template === "signup" ? "Welcome to BabySteps: Your Journey Begins Now" : `${username} please verify your account`
    const templateId = template === "signup" ? 1 : template === "subscription.purchase" ? 10 : 2
    const emailParams = params ? params : {
      USERNAME: username,
      LOGIN_URL: loginLink,
    }

    const url = 'https://api.brevo.com/v3/smtp/email';
    const apiKey = config.EMAIL_API_KEY!;
    const headers = {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    };
    const body = {
      "sender": {
        "name": "BabySteps",
        "email": "info@babysteps.world",
      },
      "replyTo": {
        "email": "info@babysteps.world",
        "name": "BabySteps"
      },
      "params": emailParams,
      "to": [
        {
          "email": email,
        }
      ],
      "subject": subject,
      "templateId": templateId
    };
    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    };
    try {
      const response = await axios.post(url, options.body, {
        headers: options.headers,
      });
      const data = response.data
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
}

export default NotificationService
