import { t } from "../trpc";
import { z } from "zod";

export const userRouter = t.router({
  getUserData: t.procedure.input(z.string()).query(async ({ input }) => {
    const userInfo = await prisma?.user.findFirst({
      where: { id: input },
    });

    const dailyPredictionInfo = await prisma?.userMatchPrediction.findFirst({
      where: { AND: [{ userId: input }, { balanceResult: null }] },
    });
    return {
      user: { ...userInfo },
      dailyPrediction: { ...dailyPredictionInfo },
    };
  }),

  updateUserBalance: t.procedure
    .input(z.number())
    .mutation(async ({ input }) => {
      const updatedUser = await prisma?.user.update({
        where: { id: "" },
        data: { balance: { decrement: input } },
        select: { id: true, balance: true },
      });

      return { user: updatedUser };
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
      const updatedUser = await prisma?.user.update({
        where: { id: input.userId },
        data: { balance: { decrement: input.predictionAmount } },
      });
      const predictionInDb = await prisma?.userMatchPrediction.create({
        data: { ...input, balanceResult: null, matchId: matchId ?? "" },
      });

      return { ...predictionInDb, newBalance: updatedUser?.balance };
    }),
});
