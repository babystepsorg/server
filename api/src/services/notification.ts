import * as SibApiV3Sdk from '@sendinblue/client'
import config from '../config'

type SendTemplate = {
  template?: 'invite-partner' | 'signup'
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
    this.sendSmtpEmail.templateId = template === "signup" ? 1 : 2
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
      email: 'noreply@babysteps.world',
      name: 'No Reply <BabySteps>',
    }

    try {
      const response = await this.apiInstance.sendTransacEmail(this.sendSmtpEmail)
      return response.body
    } catch (err: any) {
      console.log(err)
      throw new Error(err?.message ?? 'Email sending error')
    }
  }
}

export default NotificationService
