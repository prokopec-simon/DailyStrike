import { t } from "../trpc";
import { z } from "zod";

export const ladderRouter = t.router({
  getCurrentSeasonLadder: t.procedure.query(async () => {
    return await prisma?.user.findMany({
      orderBy: { balance: "desc" },
      select: { name: true, balance: true },
    });
  }),

  getAllSeasonInfo: t.procedure.query(async () => {
    return await prisma?.season.findMany({ orderBy: { start: "desc" } });
  }),

  getSeasonInfoById: t.procedure
    .input(z.object({ seasonId: z.string() }))
    .query(async () => {
      return await prisma?.season.findFirst({ orderBy: { start: "desc" } });
    }),
});
