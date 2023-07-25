import { NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { Decimal } from "@prisma/client/runtime";
import { AxiomAPIRequest, withAxiom } from "next-axiom";

const VALID_API_KEY = process.env.DAILYSTRIKE_PRIVATE_KEY;

async function handler(req: AxiomAPIRequest, res: NextApiResponse) {
  req.log.info("Received attempt to resolve daily matches.");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Incorrect HTTP method" });
  }

  const apiKey = req.headers["dailystrike-key"] || req.query.apiKey;

  if (apiKey !== VALID_API_KEY) {
    req.log.flush();
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.log.info("All conditions to resolve match fulfilled.");

  try {
    const matchToResolve = await prisma.match.findFirstOrThrow({
      orderBy: { dateAndTime: "desc" },
    });

    req.log.info("Resolving match", matchToResolve);

    if (matchToResolve.winner === null) {
      req.log.info(
        "Incorrectly called match resolving, match is not finished."
      );
      req.log.flush();
      return res
        .status(400)
        .json({ error: "Match shouldn't have been resolved." });
    }

    const predictionsToResolve = await prisma.userMatchPrediction.findMany({
      where: { matchId: matchToResolve.id },
    });

    req.log.info(`Resolving ${predictionsToResolve.length} predictions.`);

    for (const prediction of predictionsToResolve) {
      const foundUser = await prisma.user.findFirstOrThrow({
        where: { id: prediction.userId },
      });

      const balanceIncrease =
        Number(prediction.predictionOdds) * Number(prediction.predictionAmount);
      let balanceChange = 0;

      if (matchToResolve.winner === prediction.pickedTeam) {
        balanceChange = balanceIncrease;
        await prisma.user.update({
          where: { id: prediction.userId },
          data: {
            balance: Decimal.add(foundUser.balance, new Decimal(balanceChange)),
          },
        });
      } else {
        balanceChange = -balanceIncrease;
      }

      await prisma.userMatchPrediction.update({
        where: {
          userId_matchId: {
            userId: prediction.userId,
            matchId: prediction.matchId,
          },
        },
        data: {
          balanceChange: balanceChange,
          balanceAfter: Decimal.add(foundUser.balance, balanceChange),
        },
      });
    }

    req.log.flush();
    return res.status(200).json({ resultState: "Ok" });
  } catch (error) {
    req.log.error("An error occurred while processing the request.", error as Error);
    req.log.flush();
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAxiom(handler);
