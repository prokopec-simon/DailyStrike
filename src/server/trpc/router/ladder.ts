import { t } from "../trpc";
import { z } from "zod";

export const ladderRouter = t.router({
  getCurrentLadder: t.procedure.query(async () => {
    return await prisma?.user.findMany({
      orderBy: { balance: "desc" },
      select: { name: true, balance: true },
    });
  }),
});
