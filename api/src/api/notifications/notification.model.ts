import { ObjectId } from "mongodb";
import type { WithId } from "mongodb";
import * as z from "zod";
import { db } from "../../db";

export const Notification = z.object({
	userId: z.custom<ObjectId>(),
	type: z.enum(["email", "popup", "notification"]),
	status: z.enum(["pending", "sent", "failed"]),
	read: z.boolean().default(false),
	readAt: z.string().datetime().optional(),
	payload: z.object({
		subject: z.string(),
		message: z.string(),
		action: z.enum(["link", "popup", "none"]),
		link: z.string().url().optional(),
		popupContent: z.string().optional(),
	}),
	createdAt: z.string().datetime().default(new Date().toISOString()),
	updatedAt: z.string().datetime().default(new Date().toISOString()),
});

export type Notification = z.infer<typeof Notification>;
export type NotificationWithId = WithId<Notification>;
export const Notifications = db.collection<Notification>("notifications");
