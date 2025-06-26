import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Context, Next } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { jwt } from "hono/jwt";
import { PORT, JWT_SECRET } from "./config/env";
import connectionToDatabase from "./config/database";
import { routes } from "./controllers/routes";
import errorHandlerMiddleware from "./middlewares/error-handler";

const app = new Hono();

// middlewares
app.use("*", logger());
app.use(secureHeaders());
app.use(
	"*",
	cors({
		origin: ["*"],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
		credentials: true,
		maxAge: 600,
	}),
);
app.onError(errorHandlerMiddleware);

app.use("/api/v1/*", async (c: Context, next: Next) => {
	const path = c.req.path;

	//* Skip auth routes
	if (path === "/api/v1/auth/login" || path === "/api/v1/auth/register") {
		return next();
	}

	return jwt({
		secret: JWT_SECRET as string,
	})(c, next);
});

routes.forEach((route) => {
	app.route("/api/v1", route);
});

connectionToDatabase().then(() => {
	serve(
		{
			fetch: app.fetch,
			port: Number(PORT),
		},
		(info) => {
			console.log(`Server is running on http://localhost:${info.port}`);
		},
	);
});
