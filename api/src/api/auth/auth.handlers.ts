import { NextFunction, Request, Response, response } from 'express'
import { comparePassword, createUser, findUserByEmail } from '../../services/user'
import { User, UserWithId, Users } from '../../models/user'
import { generateToken, verifyToken } from '../../utils/jwt'
import { ObjectId } from 'mongodb'
import { getCurrentWeek, getCurrentWeekFromConsiveDate, getWeekFromUser } from '../../utils/week'
import { allowedEmails } from '../../constants'
import passport from 'passport'
import { Strategy } from 'passport-google-oauth20'
import { google } from 'googleapis'
import { getUserCalendarEvent } from '../../utils/calendar'
import config from '../../config'
import { ActiveUsers } from '../../models/activeUser'

type AuthUser = Omit<UserWithId, 'password' | 'salt'> & {
  tokens: {
    refresh: string
    access: string
  }
}

type Me = Omit<UserWithId, 'password' | 'salt' | 'googleAccessToken' | 'googleRefreshToken'> & { week: string, partner: boolean, partnerAvatarUrl?: (string | null) }

export async function signUp(
  req: Request<{}, AuthUser, Omit<User, 'salt'> & { token?: string }>,
  res: Response<AuthUser>,
  next: NextFunction
) {
  try {
    // check if user with this email already exists
    const isMatch = await findUserByEmail(req.body.email)
    if (isMatch) {
      res.status(422)
      throw new Error('User with this email already exists')
    }
    // get the token from the body
    console.log("Token:: ", req.body.token)
    console.log(req.body)
    const { token, ...rest } = req.body
    let partnerId = undefined
    if (token) {
      const decoded = verifyToken(token) as {
        userId: string
      }
      console.log({ decoded })
      partnerId = new ObjectId(decoded.userId)
    }
    const user = await createUser({ ...rest, partnerId })
    const accessToken = generateToken({ userId: user._id, type: 'ACCESS' })
    const refreshToken = generateToken({ userId: user._id, type: 'REFRESH' }, { expiresIn: '30d' })
    res.status(201)
    res.json({
      ...user,
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
    })
  } catch (err) {
    next(err)
  }
}



export async function logIn(
  req: Request<{}, AuthUser, Omit<User, 'salt' | 'stage' | 'role' | 'name'>>,
  res: Response<AuthUser>,
  next: NextFunction
) {
  try {
    const user = await findUserByEmail(req.body.email)
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }
    const isMatch = await comparePassword(req.body.password!, user.password!)
    if (!isMatch) {
      res.status(422)
      throw new Error('Invalid credentials')
    }
    const accessToken = generateToken({ userId: user._id, type: 'ACCESS' })
    const refreshToken = generateToken({ userId: user._id, type: 'REFRESH' }, { expiresIn: '30d' })
    const { password, salt, ...rest } = user
    res.status(200)
    res.json({
      ...rest,
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
    })
  } catch (err) {
    next(err)
  }
}

export function googleAuth(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
}

export function googleAuthCallback(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('google', { failureRedirect: '/api/v1/auth/google' }, (error, user, info) => {
    if (user) {
      const today = new Date();
      const createdAt = new Date(user.createdAt);
      const newAccount = today.getDate() === createdAt.getDate();
      const accessToken = generateToken({ userId: user._id, type: 'ACCESS' })
      const refreshToken = generateToken({ userId: user._id, type: 'REFRESH' }, { expiresIn: '30d' })
      if (newAccount) {
        return res.redirect(`${config.FRONTEND_URL}/login?access_token=${accessToken}&refresh_token=${refreshToken}&new=${newAccount}&user_id=${user._id}`)
      } else {
        return res.redirect(`${config.FRONTEND_URL}/login?access_token=${accessToken}&refresh_token=${refreshToken}&new=${newAccount}`)
      }
    }

    if (error) {
      return res.redirect(`${config.FRONTEND_URL}/login?error=${error}`)
    }

    if (info) {
      return res.redirect(`${config.FRONTEND_URL}/login?info=${info}`)
    }

    return res.redirect('/api/v1/auth/google')
  })(req, res, next)
}

// google oauth2Client
const oauth2Client = new google.auth.OAuth2(
  "868417869848-v336g58n4rkrfkotsk85meq74ggs5flp.apps.googleusercontent.com",
  "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",
  `${config.SERVER_URL}/api/v1/auth/google/calendar/callback`
)

export function googleCalandarAuth(req: Request, res: Response, next: NextFunction) {
  // const oauth2Client = new google.auth.OAuth2(
  //   "868417869848-v336g58n4rkrfkotsk85meq74ggs5flp.apps.googleusercontent.com",
  //   "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",
  //   "http://localhost:5000/api/v1/auth/google/calendar/callback"
  // )

  const scopes = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar"
  ]

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true
  })

  res.status(301)
  res.redirect(authorizationUrl)

  // res.writeHead(301, { "Location": authorizationUrl })

  // const GoogleStrategy = Strategy;

  // passport.use(
  //   new GoogleStrategy({
  //     clientID: "868417869848-v336g58n4rkrfkotsk85meq74ggs5flp.apps.googleusercontent.com",
  //     clientSecret: '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',
  //     callbackURL: 'http://localhost:5000/api/v1/auth/google/calendar/callback',
  //     passReqToCallback: true,
  //   }, 
  //   async (req, accessToken, refreshToken, profile, done) => {
  //     const user = await Users.findOneAndUpdate({ email: profile._json.email! }, { $set: { googleId: profile.id, googleAccessToken: accessToken, googleRefreshToken: refreshToken } });
  //     if (user.ok) {
  //       return done(null, user.value as Omit<UserWithId, 'salt' | 'password'>)
  //     }

  //     return done('No user found with this email...')
  //   }));
  
  // next();
}

// export function googleCalandarAuth(req: Request, res: Response) {
//   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/calendar.events', 'profile', 'email'], accessType: 'offline' })(req, res)
// }

export async function googleCalanderAuthCallback(req: Request<{}, {}, {}, { code: string }>, res: Response) {
  oauth2Client.getToken(req.query.code, async (err, tokens) => {
    if (err) {
      res.status(500)
      return res.send(err.message)
    }

    if (!tokens) {
      res.status(500);
      return res.send({ message: 'something went wrong...' })
    }

    const info = await oauth2Client.getTokenInfo(tokens.access_token!)

    if (info.email) {
      const user = await Users.findOneAndUpdate({
        "email": info.email
      }, {
        $set: {
          googleAccessToken: tokens.access_token as string,
          googleRefreshToken: tokens.refresh_token as string
        }
      })

      if (user.ok) {
        oauth2Client.setCredentials(tokens)

        // oauth2Client.getAccessToken()
  
        // Get all calendar event from the admin
        const userCalendarEvents = await getUserCalendarEvent(user.value!)


        type DateTime = {
          dateTime: string,
          timeZone: string
        }

        type Event = {
          summary: string;
          start: DateTime;
          end: DateTime;
        }

        const events: Array<Event> = [];
        userCalendarEvents.forEach(ev => {
          const start = {
            dateTime: ev.day.toISOString(),
            timeZone: 'Asia/Kolkata'
          }

          const end = {
            dateTime: ev.endDay.toISOString(),
            timeZone: 'Asia/Kolkata'
          }

          ev.tasks.forEach(task => {
            const event: Event = {
              start,
              end,
              summary: task.title
            }
            event.summary = task.title
            events.push(event)
          })
        })
  
        // const event = {
        //   summary: 'TEsting an event from the google calander',
        //   start: {
        //     dateTime: `${new Date().toISOString()}`,
        //     timeZone: 'Asia/Kolkata'
        //   },
        //   end: {
        //     dateTime: `${new Date(Date.now() + 30 * 60 * 1000).toISOString()}`,
        //     timeZone: 'Asia/Kolkata'
        //   },
        // }

        const result = await Promise.all(events.map(async (event) => {
          try {
            const insertedEvent = await google.calendar('v3').events.insert({
              auth: oauth2Client,
              calendarId: 'primary',
              requestBody: {
                summary: event.summary,
                start: event.start,
                end: event.end
              }
            });
            return insertedEvent;
          } catch (error) {
            console.error('Error inserting event:', error);
            throw error;
          }
        }));
  
  
        res.status(200)
        return res.send(result)
      } 
    }

    res.status(200)
    return res.send({ message: "Email not found..."})
  })

  // oauth2Client.getTokenInfo(tokens.access_token)
  // res.status(200)
  // res.send(tokens)
  // passport.authenticate('google', { failureRedirect: '/api/v1/auth/google/calendar'  }, (err, user, info) => {
  //   if (!err && !info) {
  //     return res.send(user);
  //   }

  //   return res.send({ err, info })
  // })
  // const calendar = google.calendar('v3').events.insert({
  //   auth: '',
  //   calendarId: 'default',
  //   oauth_token: '',
  //   requestBody: {
  //     summary: '',
  //   }
  // })
}

// export function googleAuthSignup(req: Request, res: Response) {
//   passport.authenticate('google', { scope: ['profile', 'email'] })(req, res)
// }

// export function googleAuthSignupCallback(req: Request, res: Response, next: NextFunction) {
//   passport.authenticate('google', { failureRedirect: '/api/v1/auth/google' }, (error, user, info) => {
//     if (user) {
//       const accessToken = generateToken({ userId: user._id, type: 'ACCESS' })
//       const refreshToken = generateToken({ userId: user._id, type: 'REFRESH' }, { expiresIn: '30d' })
//       return res.redirect(`https://www.babysteps.world/signup?access_token=${accessToken}&refresh_token=${refreshToken}`)
//     }
//     if (error) {
//       return res.redirect(`https://www.babysteps.world/signup?error=${error}`)
//     }

//     if (info) {
//       return res.redirect(`https://www.babysteps.world/signup?info=${info}`)
//     }

//     return res.redirect('/api/v1/auth/google')
//   })(req, res, next)
// }

export async function me(req: Request<{}, Me>, res: Response<Me>, next: NextFunction) {
  try {
    const { week } = await getWeekFromUser(req.user!);
    let partner = !!req.user?.partnerId
    let partnerAvatarUrl = null
    
    // Add the user to the active users
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const exists = await ActiveUsers.findOne({
      userId: req.user!._id,
      activityTimestamp: {
        $gte: todayStart.toISOString(),
        $lte: todayEnd.toISOString()
      }
    });
    if (!exists) {
      await ActiveUsers.insertOne({ userId: req.user!._id, activityTimestamp: new Date().toISOString() });
    }

    res.status(200)
    res.json({ 
      ...req.user!, 
      week: week.toString(), 
      partner, 
      partnerAvatarUrl
    })
  } catch (err) {
    next(err)
  }
}

export async function refreshToken(
  req: Request<{}, Pick<AuthUser, 'tokens'>, { refreshToken: string }>,
  res: Response<Pick<AuthUser, 'tokens'>>,
  next: NextFunction
) {
  try {
    const decoded = verifyToken(req.body.refreshToken) as {
      userId: string
    }

    // Todo: need to remove the expiresIn
    const accessToken = generateToken(
      { userId: decoded.userId, type: 'ACCESS' },
      { expiresIn: '4hr' }
    )
    const refreshToken = generateToken(
      { userId: decoded.userId, type: 'REFRESH' },
      { expiresIn: '30d' }
    )

    res.status(200)
    res.json({
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
    })
  } catch (err) {
    next(err)
  }
}
