/* eslint-disable @next/next/no-img-element */
import { Match, UserMatchPrediction } from "@prisma/client";
import { match } from "assert";
import { useUserDetail } from "../contexts/userContext";
import { CompetitorCard } from "./CompetitorCard";

export const HistoryMatch: React.FC<{ match: Match }> = (props) => {
  const [query] = useUserDetail();

  const balanceResult = query.data?.lastThreeMatchesResult.find(
    (match) => match.matchId == props.match.id
  );

  return (
    <div className="mt-6 flex h-28 w-4/5 justify-between self-center rounded-lg bg-zinc-800 p-3 text-white md:w-1/3">
      <CompetitorCard
        isWinner={props.match.winner == 1}
        teamName={props.match.teamA_name}
        teamOdds={props.match.teamA_odds}
        logoUrl={props.match.teamA_logoUrl}
      />
      <div className="flex h-full w-1/3 flex-col items-center">
        <div className="mt-5 flex h-7 w-12 items-center justify-center  rounded-md bg-zinc-700 text-sm text-white">
          BO{props.match.bestOf}
        </div>
        {balanceResult?.balanceResult ? (
          <div
            className={`mt-5 flex h-7 items-center justify-center rounded-md  bg-zinc-700 px-3 py-2 ${
              Number(balanceResult?.balanceResult) >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {Number(balanceResult?.balanceResult) >= 0 ? "+" : ""}
            {balanceResult?.balanceResult?.toString()}
          </div>
        ) : null}
      </div>
      <CompetitorCard
        isWinner={props.match.winner == 2}
        teamName={props.match.teamB_name}
        teamOdds={props.match.teamB_odds}
        logoUrl={props.match.teamB_logoUrl}
      />
    </div>
  );
};
