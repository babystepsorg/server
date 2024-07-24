"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpayWebhook = void 0;
async function razorpayWebhook(req, res, next) {
    try {
        console.log(req.body);
        res.send(req.body);
    }
    catch (err) {
        next(err);
    }
}
exports.razorpayWebhook = razorpayWebhook;
//# sourceMappingURL=webhook.handler.js.map