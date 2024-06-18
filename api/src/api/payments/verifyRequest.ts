import * as crypto from 'crypto';

// Function to verify the webhook request
export function verifyWebhook(message: string, receivedSignature: string): boolean {
    // Create the HMAC using SHA-256 and the secret key
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!);
    hmac.update(message);
    const expectedSignature = hmac.digest('hex');

    // Securely compare the received signature with the expected signature
    if (!crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(receivedSignature, 'hex'))) {
        return false
    }

    return true
}
