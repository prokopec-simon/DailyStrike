// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { authRouter } from "./auth";
import { ladderRouter } from "./ladder";
import { matchRouter } from "./match";
import { userRouter } from "./user";

export const appRouter = t.router({
  auth: authRouter,
  match: matchRouter,
  user: userRouter,
  ladder: ladderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
