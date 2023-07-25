import { NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { Decimal } from "@prisma/client/runtime";
import { AxiomAPIRequest, log, withAxiom } from "next-axiom";

const VALID_API_KEY = process.env.DAILYSTRIKE_PRIVATE_KEY;

async function handler(req: AxiomAPIRequest, res: NextApiResponse) {
  req.log.info("Received attempt to resolve daily matches.");
  if (req.method !== "POST") {
    res.status(405).json({ message: "Incorrect HTTP method" });
  }

  const apiKey = req.headers["dailystrike-key"] || req.query.apiKey;

  if (apiKey === VALID_API_KEY) {
    req.log.info("All conditions to resolve match fulfilled.");

    const matchToResolve = await prisma?.match.findFirstOrThrow({
      orderBy: { dateAndTime: "asc" },
    });
    const predictionsToResolve = await prisma?.userMatchPrediction.findMany({
      where: { matchId: matchToResolve.id },
    });

    req.log.info(`Resolving ${predictionsToResolve.length} predictions.`);
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

    req.log.flush();
    res.status(200).json({ resultState: "Ok" });
  } else {
    req.log.flush();
    res.status(401).json({ error: "Unauthorized" });
  }
}

export default withAxiom(handler);
