import { t } from "../trpc";
import { z } from "zod";

export const userRouter = t.router({
  getUserData: t.procedure.input(z.string()).query(async ({ input }) => {
    return await prisma?.user.findFirst({ where: { id: input } });
  }),

  updateUserBalance: t.procedure
    .input(z.object({ userId: z.string(), balanceChange: z.number() }))
    .mutation(async ({ input }) => {
      await prisma?.user.update({
        where: { id: input.userId },
        data: { balance: { decrement: input.balanceChange } },
      });
    }),
});
