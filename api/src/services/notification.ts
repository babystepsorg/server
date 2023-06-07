import * as SibApiV3Sdk from '@sendinblue/client'

type SendTemplate = {
  template?: 'invite-partner'
  username: string
  loginLink: string
  email: string
}

class NotificationService {
  private apiInstance: SibApiV3Sdk.TransactionalEmailsApi
  private sendSmtpEmail: SibApiV3Sdk.SendSmtpEmail

  constructor() {
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
    this.apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      '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'
    )
    this.sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()
  }

  async sendTemplateEmail({
    template = 'invite-partner',
    email,
    loginLink,
    username,
  }: SendTemplate) {
    this.sendSmtpEmail.subject = `{{${username}}} is inviting you to be his partner`
    this.sendSmtpEmail.templateId = 2
    this.sendSmtpEmail.params = {
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
      name: 'No Reply - BabySteps',
    }

    try {
      const response = await this.apiInstance.sendTransacEmail(this.sendSmtpEmail)
      return response.body
    } catch (err: any) {
      throw new Error(err?.message ?? 'Email sending error')
    }
  }
}

export default NotificationService
