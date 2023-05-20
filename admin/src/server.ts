import express from 'express'
import payload from 'payload'
import { Career, Waitlist } from './models'
import upload from './utils/fileUpload'

require('dotenv').config()
const app = express()

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})

// Adding email to waitlist
app.post('/api/waitlist', async (req, res) => {
  try {
    const checkEmail = await Waitlist.findOne({ email: req.body.email })
    if (checkEmail) {
      return res.status(200).send(checkEmail)
    }

    const result = new Waitlist({ email: req.body.email })
    await result.save()

    res.status(200).send(result)
  } catch (err) {
    res.status(500).send(err)
  }
})

// Applying for a career
app.post('/api/careers', upload.single('resume'), async (req, res) => {
  const request = req as typeof req & {
    file: any
  }
  const resume_location = request.file.location.split('/')
  const resume_link = 'https://admin.babysteps.world/media/' + resume_location.pop()
  const result = new Career({
    full_name: req.body.full_name,
    email: req.body.email,
    phone_number: req.body.phone,
    linkedin_url: req.body.linkedin_url,
    resume_link,
    cover_letter: req.body.cover_letter,
    portfolio_link: req.body.portfolio_link ?? '',
  })
  try {
    await result.save()
  } catch (err) {
    res.status(500).send(err)
  }
  res.status(200).send({})
})

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  // Add your own express routes here

  app.listen(3000)
}

start()
