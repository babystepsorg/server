"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyRequest_1 = require("./verifyRequest");
const razorpaySignature = "f36cd7911e79d1879834dbf39d875413ceaa6430176af05d45e360036890aeaa";
const body = JSON.stringify({ "entity": "event", "account_id": "acc_OAOkm66mA301to", "event": "subscription.authenticated", "contains": ["subscription"], "payload": { "subscription": { "entity": { "id": "sub_OPHmR4DugoAVp2", "entity": "subscription", "plan_id": "plan_OIXaWIAZy8YllS", "customer_id": "cust_OGMTy2olXMrHLo", "status": "authenticated", "current_start": null, "current_end": null, "ended_at": null, "quantity": 1, "notes": { "userId": "6672cc0da64d5c74e7e89d15", "subscriptionName": "3-Month Plan" }, "charge_at": 1720155197, "start_at": 1720155197, "end_at": 1736015400, "auth_attempts": 0, "total_count": 3, "paid_count": 0, "customer_notify": true, "created_at": 1718945598, "expire_by": null, "short_url": null, "has_scheduled_changes": false, "change_scheduled_at": null, "source": "api", "payment_method": "upi", "offer_id": null, "remaining_count": 3 } } }, "created_at": 1718945684 });
const verified = (0, verifyRequest_1.verifyWebhook)(body, razorpaySignature);
console.log({ verified });
//# sourceMappingURL=verifyRequest.test.js.map