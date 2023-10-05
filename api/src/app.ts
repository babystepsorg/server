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
    callbackURL: 'http://localhost:5000/api/v1/auth/google/callback',
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
      return done(null, foundUser)
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
      updatedAt: new Date().toISOString()
    }
    const newUser = await Users.insertOne(userObj)

    if (newUser.acknowledged) {
      const user = {
        _id: newUser.insertedId,
        ...userObj
      }
      return done(null, user as Omit<UserWithId, "password" | "salt">)
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

app.use('/api/v1', api)
// app.use('', api)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

export default app
