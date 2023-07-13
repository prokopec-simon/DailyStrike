import { t } from "../trpc";
import { z } from "zod";

export const userRouter = t.router({
  getUserMessages: t.procedure.input(z.string()).query(async ({ input }) => {
    const messages = await prisma?.message.findMany({
      where: {
        recipientUserId: input,
      },
      include: {
        recipient: true,
        sender: true,
      },
    });
    return messages;
  }),

  getUserData: t.procedure.input(z.string()).query(async ({ input }) => {
    const userInfo = await prisma?.user.findFirst({
      where: { id: input },
    });
    const dailyPrediction = (
      await prisma?.match.findFirst({
        orderBy: { dateAndTime: "desc" },
        take: 1,
        include: { UserMatchPrediction: { where: { userId: input } } },
      })
    )?.UserMatchPrediction[0];

    const lastThreeMatchIds = await prisma?.match.findMany({
      orderBy: { id: "desc" },
      take: 3,
      select: { id: true },
    });

    const lastThreeMatchesResult =
      (await prisma?.userMatchPrediction.findMany({
        where: {
          AND: [
            { userId: input },
            { matchId: { in: lastThreeMatchIds?.map((obj) => obj.id) } },
          ],
        },
      })) ?? [];
    return {
      user: { ...userInfo },
      dailyPrediction: { ...dailyPrediction },
      lastThreeMatchesResult: [...lastThreeMatchesResult],
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
      const matchId = (
        await prisma?.match.findFirst({ orderBy: { dateAndTime: "desc" } })
      )?.id;

      const updatedUser = await prisma?.user.update({
        where: { id: input.userId },
        data: { balance: { decrement: input.predictionAmount } },
      });
      const predictionInDb = await prisma?.userMatchPrediction.create({
        data: { ...input, matchId: matchId ?? "" },
      });

      return { ...predictionInDb, newBalance: updatedUser?.balance };
    }),

  getUserMatchHistory: t.procedure
    .input(z.string())
    .query(async ({ input }) => {
      const userHistory = await prisma?.userMatchPrediction.findMany({
        where: { userId: input },
        include: { match: true },
        orderBy: { match: { dateAndTime: "desc" } },
      });

      return userHistory;
    }),

  getUserBalanceHistory: t.procedure
    .input(z.string())
    .query(async ({ input }) => {
      const userHistory = await prisma?.userMatchPrediction.findMany({
        where: { AND: { userId: input, NOT: { balanceAfter: null } } },
        include: { match: true },
        orderBy: { match: { dateAndTime: "asc" } },
      });

      const currentSeason = await prisma?.season.findFirstOrThrow({
        orderBy: { end: "desc" },
      });

      if (!currentSeason) {
        return [];
      }

      const result = userHistory?.map((prediction) => {
        return {
          balanceAfter: Number(prediction.balanceAfter),
          dateAndTime: prediction.match.dateAndTime,
        };
      });
      return [
        {
          balanceAfter: 100,
          dateAndTime: currentSeason.start,
        },
      ].concat(result ?? []);
    }),
});
