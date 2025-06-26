import authRouter from "./auth/route";
import noteRouter from "./note/route";

export const routes = [authRouter, noteRouter];

export type AppRoute = (typeof routes)[number];
