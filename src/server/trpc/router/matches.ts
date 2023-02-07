import { t } from "../trpc";
import { z } from "zod";

export const matchesRouter = t.router({
  getUpcomingMatch: t.procedure.query(async () => {
    return await prisma?.match.findFirst({ where: { winner: 0 } });
  }),

  getLastNMatches: t.procedure
    .input(z.object({ matchCount: z.number() }))
    .query(async ({ input }) => {
      return await prisma?.match.findMany({
        where: { NOT: { winner: 0 } },
        orderBy: { dateAndTime: "desc" },
        take: input.matchCount,
      });
    }),
});
