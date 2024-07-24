"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const middlewares = __importStar(require("./middlewares"));
const api_1 = __importDefault(require("./api"));
const user_1 = require("./models/user");
require('dotenv').config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
passport_1.default.use(new GoogleStrategy({
    clientID: "868417869848-v336g58n4rkrfkotsk85meq74ggs5flp.apps.googleusercontent.com",
    clientSecret: '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',
    callbackURL: 'https://api.babysteps.world/api/v1/auth/google/callback',
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    // create or find user
    const email = profile._json.email;
    if (email === undefined) {
        return done('Email not found');
    }
    const foundUser = await user_1.Users.findOne({ email });
    if (foundUser) {
        if (!foundUser.avatarUrl || !foundUser.googleAccessToken || !foundUser.googleRefreshToken) {
            const updatedUser = await user_1.Users.findOneAndUpdate({
                _id: foundUser._id
            }, {
                $set: {
                    googleAccessToken: accessToken,
                    googleRefreshToken: refreshToken,
                    avatarUrl: profile._json.profile
                }
            });
            if (updatedUser.ok) {
                return done(null, updatedUser.value);
            }
        }
        return done(null, foundUser);
    }
    // else create the user
    const userObj = {
        email: profile._json.email,
        name: profile.displayName,
        password: null,
        role: 'caregiver',
        stage: 'postpartum',
        salt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        googleId: profile.id,
        googleAccessToken: accessToken,
        googleRefreshToken: refreshToken,
        avatarUrl: profile._json.picture
    };
    const newUser = await user_1.Users.insertOne(userObj);
    if (newUser.acknowledged) {
        const user = {
            _id: newUser.insertedId,
            ...userObj
        };
        return done(null, user);
    }
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
app.get('/', (req, res) => {
    res.json({
        message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
    });
});
app.use('/api/v1', api_1.default);
// app.use('', api)
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map