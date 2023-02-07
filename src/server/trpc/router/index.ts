// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { authRouter } from "./auth";
import { matchesRouter } from "./matches";

export const appRouter = t.router({
  auth: authRouter,
  matches: matchesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
