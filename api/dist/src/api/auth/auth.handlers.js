"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.me = exports.googleCalanderAuthCallback = exports.googleCalandarAuth = exports.googleAuthCallback = exports.googleAuth = exports.logIn = exports.signUp = void 0;
const user_1 = require("../../services/user");
const user_2 = require("../../models/user");
const jwt_1 = require("../../utils/jwt");
const mongodb_1 = require("mongodb");
const week_1 = require("../../utils/week");
const passport_1 = __importDefault(require("passport"));
const googleapis_1 = require("googleapis");
async function signUp(req, res, next) {
    try {
        // check if user with this email already exists
        const isMatch = await (0, user_1.findUserByEmail)(req.body.email);
        if (isMatch) {
            res.status(422);
            throw new Error('User with this email already exists');
        }
        // get the token from the body
        const { token, ...rest } = req.body;
        let partnerId = undefined;
        if (token) {
            const decoded = (0, jwt_1.verifyToken)(token);
            partnerId = new mongodb_1.ObjectId(decoded.userId);
        }
        const user = await (0, user_1.createUser)({ ...rest, partnerId });
        const accessToken = (0, jwt_1.generateToken)({ userId: user._id, type: 'ACCESS' });
        const refreshToken = (0, jwt_1.generateToken)({ userId: user._id, type: 'REFRESH' }, { expiresIn: '30d' });
        res.status(201);
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
async function logIn(req, res, next) {
    try {
        const user = await (0, user_1.findUserByEmail)(req.body.email);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
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
function googleAuth(req, res) {
    passport_1.default.authenticate('google', { scope: ['profile', 'email'] })(req, res);
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
                return res.redirect(`https://www.babysteps.world/login?access_token=${accessToken}&refresh_token=${refreshToken}&new=${newAccount}&user_id=${user._id}`);
            }
            else {
                return res.redirect(`https://www.babysteps.world/login?access_token=${accessToken}&refresh_token=${refreshToken}&new=${newAccount}`);
            }
        }
        if (error) {
            return res.redirect(`https://www.babysteps.world/login?error=${error}`);
        }
        if (info) {
            return res.redirect(`https://www.babysteps.world/login?info=${info}`);
        }
        return res.redirect('/api/v1/auth/google');
    })(req, res, next);
}
exports.googleAuthCallback = googleAuthCallback;
// google oauth2Client
const oauth2Client = new googleapis_1.google.auth.OAuth2("868417869848-v336g58n4rkrfkotsk85meq74ggs5flp.apps.googleusercontent.com", "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", "http://localhost:5000/api/v1/auth/google/calendar/callback");
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
            user_2.Users.findOneAndUpdate({
                "email": info.email
            }, {
                $set: {
                    googleAccessToken: tokens.access_token,
                    googleRefreshToken: tokens.refresh_token
                }
            });
            oauth2Client.setCredentials(tokens);
            const calendars = await googleapis_1.google.calendar('v3').calendars.get({
                auth: oauth2Client
            });
            res.status(200);
            return res.send(calendars);
            const calendar = await googleapis_1.google.calendar('v3').events.insert({
                auth: oauth2Client,
                calendarId: 'default',
                requestBody: {
                    summary: 'TEsting an event from the google calander',
                    start: {
                        dateTime: `${new Date().toISOString()}`,
                        timeZone: 'Asia/Kolkata'
                    },
                    end: {
                        dateTime: `${new Date(Date.now() + 30 * 60 * 1000).toISOString()}`,
                        timeZone: 'Asia/Kolkata'
                    },
                }
            });
            res.status(200);
            return res.send(calendar);
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
        if (!partner) {
            const foundUser = await user_2.Users.findOne({ partnerId: req.user._id });
            if (foundUser) {
                partner = true;
            }
            else {
                partner = false;
            }
        }
        res.status(200);
        res.json({ ...req.user, week: week.toString(), partner });
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