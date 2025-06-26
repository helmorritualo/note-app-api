import User from "@/models/user.model";
import { Context } from "hono";
import { BadRequestError, NotFoundError } from "@/utils/error";
import { sign } from "hono/jwt";
import { compare, hash } from "bcrypt";
import { JWT_SECRET } from "@/config/env";

export const register = async (c: Context) => {
	try {
		const { email, username, password } = c.get("validatedRegisterData");

		const isUserAlreadyExist = await User.findOne({ email });
		if (!isUserAlreadyExist) {
			throw new BadRequestError("User already exist");
		}

		const hashedPassword = await hash(password, 10);
		const newUser = new User({
			email,
			username,
			password: hashedPassword,
		});

		await newUser.save();

		const { password: _, ...userWithoutPassword } = newUser.toObject();

		return c.json(
			{
				success: true,
				message: "User registerd successfully",
				data: {
					user: userWithoutPassword,
				},
			},
			201,
		);
	} catch (error) {
		if (error instanceof BadRequestError) {
			throw error;
		}
	}
};

export const login = async (c: Context) => {
	try {
		const { username, password } = c.get("validatedLoginData");

		const user = await User.findOne({ username });
		if (!user) {
			throw new NotFoundError("User not found");
		}

		const isPasswordMatch = await compare(password, user.password);
		if (!isPasswordMatch) {
			throw new BadRequestError("Invalid password");
		}

		const token = await sign(
			{
				user_id: user._id,
				email: user.email,
				exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, // token expire on 12 hours
			},
			JWT_SECRET as string,
		);

		const { password: _, ...userWithoutPassword } = user.toObject();

		return c.json(
			{
				success: true,
				data: {
					user: userWithoutPassword,
					token,
				},
			},
			200,
		);
	} catch (error) {
		if (error instanceof NotFoundError || error instanceof BadRequestError) {
			throw error;
		}
	}
};
