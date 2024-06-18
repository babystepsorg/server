import { Request, Response, NextFunction } from "express";

export async function razorpayWebhook(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        console.log(req.body)
        res.send(req.body)
    } catch (err) {
        next(err)
    }
}