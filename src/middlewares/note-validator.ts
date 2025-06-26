import { Context, Next } from "hono";
import { BadRequestError } from "@/utils/error";
import { z } from "zod/v4";

const noteSchema = z.object({
	title: z
		.string({
			message: "Title is required",
		})
		.min(6, {
			message: "Title must be at least 6 characters long",
		}),

	note: z.string({
		message: "Note is required",
	}),
});

export const validateNote = async (c: Context, next: Next) => {
	try {
		const body = await c.req.json();
		const validateData = noteSchema.safeParse(body);

		c.set("validatedNoteData", validateData);

		await next();
	} catch (zodError) {
		if (zodError instanceof z.ZodError) {
			const errorMessage = zodError.issues
				.map((issue) => `${issue.message}`)
				.join(", ");
			throw new BadRequestError(errorMessage);
		}
	}
	throw new BadRequestError("Invalid request data");
};
