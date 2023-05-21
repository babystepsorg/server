import nodemailer from 'nodemailer'

export const sendMail = (subject: string, body: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'tech@babysteps.world',
      pass: 'Alzmqp10#',
    },
  })

  const mailOptions = {
    from: 'Tech BabySteps <tech@babysteps.world>',
    to: 'careers@babysteps.world',
    subject: subject,
    html: body,
  }
  transporter.sendMail(mailOptions, (err: any, info: any) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(info)
  })
}
