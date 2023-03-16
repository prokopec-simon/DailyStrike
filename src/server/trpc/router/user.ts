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
    .input(z.object({ userId: z.string(), balanceChange: z.number() }))
    .mutation(async ({ input }) => {
      const updatedUser = await prisma?.user.update({
        where: { id: input.userId },
        data: { balance: { decrement: input.balanceChange } },
        select: { id: true, balance: true },
      });

      return { user: updatedUser };
    }),
});
