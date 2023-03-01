import { t } from "../trpc";
import { z } from "zod";

export const userRouter = t.router({
  getUserData: t.procedure.input(z.string()).query(async ({ input }) => {
    return await prisma?.user.findFirst({ where: { id: input } });
  }),
});
