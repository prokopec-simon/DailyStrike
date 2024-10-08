import { t } from "../trpc";
import { z } from "zod";

export const matchRouter = t.router({
  getUpcomingMatch: t.procedure.query(async () => {
    return await prisma?.match.findFirst({ orderBy: { dateAndTime: "desc" } });
  }),

  getLastNMatches: t.procedure
    .input(z.object({ matchCount: z.number() }))
    .query(async ({ input }) => {
      return await prisma?.match.findMany({
        where: { NOT: { winner: undefined } },
        orderBy: { dateAndTime: "desc" },
        skip: 1,
        take: input.matchCount,
      });
    }),
});
