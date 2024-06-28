import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import passport from 'passport'
import strategy from 'passport-google-oauth20'

import * as middlewares from './middlewares'
import api from './api'
import MessageResponse from './interfaces/MessageResponse'
import { UserWithId, Users } from './models/user'
import { ObjectId } from 'mongodb'
import config from './config'
import cron from 'node-cron'
import { notificationEveryFourHours, notificationDailyMidMorning, notificationDailyEvening, notificationDailyMidday } from './api/notifications/notification.job'

require('dotenv').config()

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(passport.initialize())

const GoogleStrategy = strategy.Strategy;

passport.use(
  new GoogleStrategy({
    clientID: "868417869848-v336g58n4rkrfkotsk85meq74ggs5flp.apps.googleusercontent.com",
    clientSecret: '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',
    callbackURL: `${config.SERVER_URL}/api/v1/auth/google/callback`,
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    // create or find user
    const email = profile._json.email

    if (email === undefined) {
      return done('Email not found')
    }

    const foundUser = await Users.findOne({ email })
    if (foundUser) {
      if (!foundUser.avatarUrl || !foundUser.googleAccessToken) {
        const updatedUser = await Users.findOneAndUpdate({
          _id: foundUser._id
        }, {
          $set: {
            googleAccessToken: accessToken,
            googleRefreshToken: refreshToken,
            avatarUrl: profile._json.picture
          }
        })

        if (updatedUser.ok) {
          return done(null, {...updatedUser.value!, root: true})
        }
      }
      return done(null, {...foundUser, root: true })
    }

    // else create the user
    const userObj = {
      email: profile._json.email!,
      name: profile.displayName,
      password: null,
      role: 'caregiver' as 'caregiver' | 'nurturer',
      stage: 'postpartum' as 'pre-conception' | 'pregnancy' | 'postpartum',
      salt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      googleId: profile.id,
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
      avatarUrl: profile._json.picture,
      verified: true
    }
    const newUser = await Users.insertOne(userObj)

    if (newUser.acknowledged) {
      const user = {
        _id: newUser.insertedId,
        ...userObj,
        root: true,
        verified: true
      }
      return done(null, user as Omit<UserWithId, "password" | "salt"> & { root: boolean })
    }
  }
  )
);

passport.serializeUser(function(user: any, done) {
  done(null, user);
});
  
passport.deserializeUser(function(user: any, done) {
  done(null, user);
});

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  })
})

cron.schedule("0 */4 * * *", notificationEveryFourHours, {
  timezone: "Asia/Kolkata"
})
cron.schedule("0 9 * * *", notificationDailyMidMorning, {
  timezone: "Asia/Kolkata"
})
cron.schedule("0 17 * * *", notificationDailyEvening, {
  timezone: "Asia/Kolkata"
})
cron.schedule("0 12 * * *", notificationDailyMidday, {
  timezone: "Asia/Kolkata"
})

app.use('/api/v1', api)
// app.use('', api)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

export default app
