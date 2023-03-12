import { t } from "../trpc";
import { z } from "zod";

export const matchRouter = t.router({
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

  placePrediction: t.procedure
    .input(
      z.object({
        userId: z.string(),
        pickedTeam: z.number().int(),
        predictionOdds: z.number(),
        predictionAmount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const matchId = (await prisma?.match.findFirst({ where: { winner: 0 } }))
        ?.id;
      await prisma?.user.update({
        where: { id: input.userId },
        data: { balance: { decrement: input.predictionAmount } },
      });
      const predictionInDb = await prisma?.userMatchPrediction.create({
        data: { ...input, balanceResult: null, matchId: matchId ?? "" },
      });

      return predictionInDb;
    }),
});
