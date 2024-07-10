import express from 'express'
import payload from 'payload'
import { Career, Waitlist } from './models'
import upload from './utils/fileUpload'
import cors from 'cors'
import morgan from 'morgan'
import { sendMail } from './utils/sendEmail'

require('dotenv').config()
const app = express()

app.use(express.json())
app.use(morgan('combined'))

// Cors
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST',
  })
)

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
    job: req.body.job,
  })
  try {
    await result.save()
    sendMail(
      `${req.body.full_name} applied for ${req.body.job} on Careers page`,
      `
      <p>A new job application has been submitted for the role of ${
        req.body.job
      }. Please find the details of the applicant below.</p>
      <br />

      Full Name: <strong>${req.body.full_name}</strong><br />
      Email: <strong>${req.body.email}</strong><br />
      Phone Number: <strong>${req.body.phone}</strong><br />
      LinkedIn URL: <strong>${req.body.linkedin_url}</strong><br />
      Resume Link: <strong>${resume_link}</strong><br />
      Cover Letter: <strong>${req.body.cover_letter}</strong><br />
      Portfolio Link: <strong>${req.body.portfolio_link || 'Not provided'}</strong><br />
      `
    )
  } catch (err) {
    res.status(500).send(err)
  }
  res.status(200).send({})
})

const start = async (): Promise<void> => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  app.get("/week-info/:id", async (req, res) => {
    try {
      const [symptoms, products, content, todos] = await Promise.all([
        payload.find({
          collection: 'symptoms',
          where: {
            weeks: {
              in: [req.params.id]
            }
          }
        }),
        payload.find({
          collection: 'products',
          where: {
            weeks: {
              in: [req.params.id]
            }
          }
        }),
        payload.find({
          collection: 'contents',
          where: {
            weeks: {
              in: [req.params.id]
            }
          }
        }),
        payload.find({
          collection: 'todos',
          where: {
            week: {
              in: [req.params.id]
            }
          }
        })
      ])

      const data = { symptoms, products, content, todos }
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  app.get("/change-collection", async (req, res) => {
    try {
      const result = await payload.db.connection.db.renameCollection('_content_versions', '_contents_versions')
      res.send(result)
    } catch (err) {
      res.send(err)
    }
  })

  app.listen(process.env.PORT || 3000, async () => {
    payload.logger.info(`Server listening on port ${process.env.PORT || 3000}`)
  })
}

start()
