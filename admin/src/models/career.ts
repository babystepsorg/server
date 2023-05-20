import { Schema, model } from 'mongoose'

const careerSchema = new Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    linkedin_url: {
      type: String,
      required: true,
    },
    portfolio_link: {
      type: String,
    },
    resume_link: {
      type: String,
      required: true,
    },
    cover_letter: {
      type: String,
    },
    job: {
      type: String,
      required: true
    }
  },
  {
    strict: false,
    timestamps: true,
  }
)

const Career = model('career', careerSchema)

export default Career
