import authRouter from "./auth/route";
import noteRouter from "./note/route";
import categoryRouter from "./category/route";

export const routes = [authRouter, noteRouter, categoryRouter];

export type AppRoute = (typeof routes)[number];
