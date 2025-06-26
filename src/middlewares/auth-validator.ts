import { Context, Next } from "hono";
import { BadRequestError } from "@/utils/error";
import { z } from "zod/v4";

const registerSchema = z.object({
	email: z.email({
		pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		message: "Invalid email format",
	}),
	username: z
		.string({
			message: "Username is required",
		})
		.min(4, {
			message: "Username must be at least 4 characters long",
		}),
	password: z
		.string({
			message: "Password is required",
		})
		.min(8, {
			message: "Password must be at leat 8 characters long",
		}),
});

const loginSchema = z.object({
	username: z.string({
		message: "Username is required",
	}),
	password: z.string({
		message: "Password is required",
	}),
});

export const validateRegister = async (c: Context, next: Next) => {
	try {
		const body = await c.req.json();
		const validatedData = registerSchema.parse(body);

		c.set("validatedRegisterData", validatedData);

		await next();
	} catch (zodError) {
		if (zodError instanceof z.ZodError) {
			const errorMessages = zodError.issues
				.map((issue) => `${issue.message}`)
				.join(", ");
			throw new BadRequestError(errorMessages);
		}
		throw new BadRequestError("Invalid request data");
	}
};

export const validateLogin = async (c: Context, next: Next) => {
	try {
		const body = await c.req.json();
		const validatedData = loginSchema.parse(body);

		c.set("validatedLoginData", validatedData);

		await next();
	} catch (zodError) {
		if (zodError instanceof z.ZodError) {
			const errorMessages = zodError.issues
				.map((issue) => `${issue.message}`)
				.join(", ");
			throw new BadRequestError(errorMessages);
		}
		throw new BadRequestError("Invalid request data");
	}
};
