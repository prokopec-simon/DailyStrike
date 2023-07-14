import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { Decimal } from "@prisma/client/runtime";
import { defaultLog, flushLogs } from "../../utils/logging";

const VALID_API_KEY = process.env.DAILYSTRIKE_PRIVATE_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  defaultLog("Hit match resolving endpoint", "info");
  if (req.method !== "POST") {
    res.status(405).json({ message: "Incorrect HTTP method" });
  }

  const apiKey = req.headers["dailystrike-key"] || req.query.apiKey;

  if (apiKey === VALID_API_KEY) {
    const matchToResolve = await prisma?.match.findFirstOrThrow({
      orderBy: { dateAndTime: "asc" },
    });
    const predictionsToResolve = await prisma?.userMatchPrediction.findMany({
      where: { matchId: matchToResolve.id },
    });

    defaultLog(
      "Valid auth, resolving daily match",
      "info",
      undefined,
      predictionsToResolve
    );

    predictionsToResolve.forEach(async (prediction: any) => {
      const foundUser = await prisma.user.findFirstOrThrow({
        where: { id: prediction.userId },
      });

      let balanceIncrease =
        Number(prediction.predictionOdds) * Number(prediction.predictionAmount);

      if (matchToResolve.winner !== prediction.pickedTeam) {
        balanceIncrease = -balanceIncrease;
      }

      await prisma.user.update({
        where: { id: prediction.userId },
        data: {
          balance: Decimal.add(foundUser.balance, new Decimal(balanceIncrease)),
        },
      });

      await prisma.userMatchPrediction.update({
        where: {
          userId_matchId: {
            userId: prediction.userId,
            matchId: prediction.matchId,
          },
        },
        data: { balanceChange: balanceIncrease },
      });
    });

    await flushLogs();
    res.status(200).json({ resultState: "Ok" });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}
