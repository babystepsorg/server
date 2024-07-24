"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPartnerInfo = exports.saveMentalhealth = void 0;
const mentalHealth_model_1 = require("./mentalHealth.model");
const mongodb_1 = require("mongodb");
const saveMentalhealth = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { emotion, description } = req.body;
        const mentalHealth = {
            emotion,
            description,
            userId: new mongodb_1.ObjectId(userId),
            createdAt: new Date().toISOString()
        };
        const result = await mentalHealth_model_1.Mentalhealths.insertOne(mentalHealth);
        if (!result.acknowledged) {
            throw new Error("Error inserting Mentalhealth");
        }
        res.status(201).json({
            _id: result.insertedId,
            ...mentalHealth
        });
    }
    catch (err) {
        next(err);
    }
};
exports.saveMentalhealth = saveMentalhealth;
const getPartnerInfo = async (req, res, next) => {
    try {
        const partnerId = req.user.partnerId;
        if (partnerId) {
            const mentalHealth = await mentalHealth_model_1.Mentalhealths.find({
                userId: new mongodb_1.ObjectId(partnerId),
            }).sort({ createdAt: -1 }).limit(1).toArray();
            if (!mentalHealth) {
                res.status(404);
                throw new Error("Mental health not found");
            }
            res.status(200).json(mentalHealth[0]);
        }
        throw new Error("Parnter not found");
    }
    catch (err) {
        next(err);
    }
};
exports.getPartnerInfo = getPartnerInfo;
//# sourceMappingURL=mentalHealth.handler.js.map