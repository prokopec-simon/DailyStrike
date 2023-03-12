import { t } from "../trpc";
import { z } from "zod";
import { getSession } from "next-auth/react";

export const userRouter = t.router({
  getUserData: t.procedure.input(z.string()).query(async ({ input }) => {
    return await prisma?.user.findFirst({ where: { id: input } });
  }),

  updateUserBalance: t.procedure
    .input(z.object({ userId: z.string(), balanceChange: z.number() }))
    .mutation(async ({ input }) => {
      debugger;
      const updatedUser = await prisma?.user.update({
        where: { id: input.userId },
        data: { balance: { decrement: input.balanceChange } },
        select: { id: true, balance: true },
      });

      return { user: updatedUser };
    }),
});
