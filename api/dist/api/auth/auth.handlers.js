"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.me = exports.googleCalanderAuthCallback = exports.googleCalandarAuth = exports.googleAuthCallback = exports.googleAuth = exports.logIn = exports.verifyAccount = exports.signUp = void 0;
const user_1 = require("../../services/user");
const user_2 = require("../../models/user");
const jwt_1 = require("../../utils/jwt");
const mongodb_1 = require("mongodb");
const week_1 = require("../../utils/week");
const passport_1 = __importDefault(require("passport"));
const googleapis_1 = require("googleapis");
const calendar_1 = require("../../utils/calendar");
const config_1 = __importDefault(require("../../config"));
const activeUser_1 = require("../../models/activeUser");
const notification_1 = __importDefault(require("../../services/notification"));
const notification_model_1 = require("../notifications/notification.model");
async function signUp(req, res, next) {
    const origin = req.headers.origin;
    try {
        // check if user with this email already exists
        const isMatch = await (0, user_1.findUserByEmail)(req.body.email);
        if (isMatch) {
            res.status(422);
            throw new Error('User with this email already exists');
        }
        const { token, ...rest } = req.body;
        let partnerId = undefined;
        if (token) {
            const decoded = (0, jwt_1.verifyToken)(token);
            partnerId = new mongodb_1.ObjectId(decoded.userId);
        }
        const user = await (0, user_1.createUser)({ ...rest, partnerId });
        // const verifyTokenLink = generateToken({ userId: user._id, type: 'VERIFY' }, { expiresIn: '30d' })
        // const verificationLink = `https://api.babysteps.world/api/v1/auth/verify?token=${verifyTokenLink}&origin=${origin}`
        // const notificationService = new NotificationService
        // notificationService.sendTemplateEmail({
        //   template: "signup",
        //   email: user.email,
        //   loginLink: verificationLink,
        //   username: user.name
        // })
        // // const accessToken = generateToken({ userId: user._id, type: 'ACCESS' })
        // // const refreshToken = generateToken({ userId: user._id, type: 'REFRESH' }, { expiresIn: '30d' })
        // res.status(201)
        // res.json({
        //   message: 'Please verify your account by clicking on the link sent to your email',
        //   status: 'OK'
        // })
        // Send Email to the user
        //
        const notificationService = new notification_1.default();
        notificationService.sendTemplateEmail({
            email: user.email,
            loginLink: "",
            template: "signup",
            params: {
                NAME: user.name
            },
            username: req.user?.name,
        });
        notification_model_1.Notifications.insertOne({
            type: "notification",
            status: "sent",
            payload: {
                subject: "Welcome to BabySteps! Watch this short video to get started and make the most of your companion",
                message: "",
                action: "link",
            },
            userId: user._id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            read: false
        });
        const accessToken = (0, jwt_1.generateToken)({ userId: user._id, type: 'ACCESS' });
        const refreshToken = (0, jwt_1.generateToken)({ userId: user._id, type: 'REFRESH' }, { expiresIn: '30d' });
        res.status(200);
        res.json({
            ...user,
            tokens: {
                access: accessToken,
                refresh: refreshToken,
            },
        });
    }
    catch (err) {
        next(err);
    }
}
exports.signUp = signUp;
async function verifyAccount(req, res, next) {
    try {
        const decoded = (0, jwt_1.verifyToken)(req.query.token);
        if (decoded.type && decoded.type !== 'VERIFY') {
            res.status(400);
            throw new Error('Invalid token type');
        }
        const user = await user_2.Users.findOneAndUpdate(new mongodb_1.ObjectId(decoded.userId), { $set: { verified: true } });
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        res.redirect(`${req.query.origin}/signin`);
    }
    catch (err) {
        next(err);
    }
}
exports.verifyAccount = verifyAccount;
async function logIn(req, res, next) {
    try {
        const user = await (0, user_1.findUserByEmail)(req.body.email);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        // if (!user.verified) {
        //   res.status(401)
        //   throw new Error('Email not verified')
        // }
        const isMatch = await (0, user_1.comparePassword)(req.body.password, user.password);
        if (!isMatch) {
            res.status(422);
            throw new Error('Invalid credentials');
        }
        const accessToken = (0, jwt_1.generateToken)({ userId: user._id, type: 'ACCESS' });
        const refreshToken = (0, jwt_1.generateToken)({ userId: user._id, type: 'REFRESH' }, { expiresIn: '30d' });
        const { password, salt, ...rest } = user;
        res.status(200);
        res.json({
            ...rest,
            tokens: {
                access: accessToken,
                refresh: refreshToken,
            },
        });
    }
    catch (err) {
        next(err);
    }
}
exports.logIn = logIn;
function googleAuth(req, res, next) {
    passport_1.default.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}
exports.googleAuth = googleAuth;
function googleAuthCallback(req, res, next) {
    passport_1.default.authenticate('google', { failureRedirect: '/api/v1/auth/google' }, (error, user, info) => {
        if (user) {
            const today = new Date();
            const createdAt = new Date(user.createdAt);
            const newAccount = today.getDate() === createdAt.getDate();
            const accessToken = (0, jwt_1.generateToken)({ userId: user._id, type: 'ACCESS' });
            const refreshToken = (0, jwt_1.generateToken)({ userId: user._id, type: 'REFRESH' }, { expiresIn: '30d' });
            if (newAccount) {
                return res.redirect(`${config_1.default.FRONTEND_URL}/login?access_token=${accessToken}&refresh_token=${refreshToken}&new=${newAccount}&user_id=${user._id}`);
            }
            else {
                return res.redirect(`${config_1.default.FRONTEND_URL}/login?access_token=${accessToken}&refresh_token=${refreshToken}&new=${newAccount}`);
            }
        }
        if (error) {
            return res.redirect(`${config_1.default.FRONTEND_URL}/login?error=${error}`);
        }
        if (info) {
            return res.redirect(`${config_1.default.FRONTEND_URL}/login?info=${info}`);
        }
        return res.redirect('/api/v1/auth/google');
    })(req, res, next);
}
exports.googleAuthCallback = googleAuthCallback;
// google oauth2Client
const oauth2Client = new googleapis_1.google.auth.OAuth2("868417869848-v336g58n4rkrfkotsk85meq74ggs5flp.apps.googleusercontent.com", "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", `${config_1.default.SERVER_URL}/api/v1/auth/google/calendar/callback`);
function googleCalandarAuth(req, res, next) {
    // const oauth2Client = new google.auth.OAuth2(
    //   "868417869848-v336g58n4rkrfkotsk85meq74ggs5flp.apps.googleusercontent.com",
    //   "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",
    //   "http://localhost:5000/api/v1/auth/google/calendar/callback"
    // )
    const scopes = [
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/calendar"
    ];
    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true
    });
    res.status(301);
    res.redirect(authorizationUrl);
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
exports.googleCalandarAuth = googleCalandarAuth;
// export function googleCalandarAuth(req: Request, res: Response) {
//   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/calendar.events', 'profile', 'email'], accessType: 'offline' })(req, res)
// }
async function googleCalanderAuthCallback(req, res) {
    oauth2Client.getToken(req.query.code, async (err, tokens) => {
        if (err) {
            res.status(500);
            return res.send(err.message);
        }
        if (!tokens) {
            res.status(500);
            return res.send({ message: 'something went wrong...' });
        }
        const info = await oauth2Client.getTokenInfo(tokens.access_token);
        if (info.email) {
            const user = await user_2.Users.findOneAndUpdate({
                "email": info.email
            }, {
                $set: {
                    googleAccessToken: tokens.access_token,
                    googleRefreshToken: tokens.refresh_token
                }
            });
            if (user.ok) {
                oauth2Client.setCredentials(tokens);
                // oauth2Client.getAccessToken()
                // Get all calendar event from the admin
                const userCalendarEvents = await (0, calendar_1.getUserCalendarEvent)(user.value);
                const events = [];
                userCalendarEvents.forEach(ev => {
                    const start = {
                        dateTime: ev.day.toISOString(),
                        timeZone: 'Asia/Kolkata'
                    };
                    const end = {
                        dateTime: ev.endDay.toISOString(),
                        timeZone: 'Asia/Kolkata'
                    };
                    ev.tasks.forEach(task => {
                        const event = {
                            start,
                            end,
                            summary: task.title
                        };
                        event.summary = task.title;
                        events.push(event);
                    });
                });
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
                        const insertedEvent = await googleapis_1.google.calendar('v3').events.insert({
                            auth: oauth2Client,
                            calendarId: 'primary',
                            requestBody: {
                                summary: event.summary,
                                start: event.start,
                                end: event.end
                            }
                        });
                        return insertedEvent;
                    }
                    catch (error) {
                        console.error('Error inserting event:', error);
                        throw error;
                    }
                }));
                res.status(200);
                return res.send(result);
            }
        }
        res.status(200);
        return res.send({ message: "Email not found..." });
    });
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
exports.googleCalanderAuthCallback = googleCalanderAuthCallback;
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
async function me(req, res, next) {
    try {
        const { week } = await (0, week_1.getWeekFromUser)(req.user);
        let partner = !!req.user?.partnerId;
        let partnerAvatarUrl = null;
        if (req.user && !req.user.referralId) {
            let referralId = null;
            do {
                referralId = Math.floor(100000 + Math.random() * 900000).toString();
            } while (await user_2.Users.findOne({ referralId }));
            await user_2.Users.updateOne({ _id: req.user._id }, { $set: { referralId: referralId } });
            req.user.referralId = referralId;
        }
        // Add the user to the active users
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const exists = await activeUser_1.ActiveUsers.findOne({
            userId: req.user._id,
            activityTimestamp: {
                $gte: todayStart.toISOString(),
                $lte: todayEnd.toISOString()
            }
        });
        if (!exists) {
            await activeUser_1.ActiveUsers.insertOne({ userId: req.user._id, activityTimestamp: new Date().toISOString() });
        }
        res.status(200);
        res.json({
            ...req.user,
            week: week.toString(),
            partner,
            partnerAvatarUrl
        });
    }
    catch (err) {
        next(err);
    }
}
exports.me = me;
async function refreshToken(req, res, next) {
    try {
        const decoded = (0, jwt_1.verifyToken)(req.body.refreshToken);
        // Todo: need to remove the expiresIn
        const accessToken = (0, jwt_1.generateToken)({ userId: decoded.userId, type: 'ACCESS' }, { expiresIn: '4hr' });
        const refreshToken = (0, jwt_1.generateToken)({ userId: decoded.userId, type: 'REFRESH' }, { expiresIn: '30d' });
        res.status(200);
        res.json({
            tokens: {
                access: accessToken,
                refresh: refreshToken,
            },
        });
    }
    catch (err) {
        next(err);
    }
}
exports.refreshToken = refreshToken;
//# sourceMappingURL=auth.handlers.js.map