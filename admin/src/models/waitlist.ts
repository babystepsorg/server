import { Schema, model } from 'mongoose'

const waitlistScheme = new Schema(
  {
    email: String,
  },
  {
    strict: false,
    timestamps: true,
  }
)

const Waitlist = model('waitlist', waitlistScheme)

export default Waitlist
