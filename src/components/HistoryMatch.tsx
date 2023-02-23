/* eslint-disable @next/next/no-img-element */
import { Match } from "@prisma/client";
import { CompetitorCard } from "./TeamInfo";

export const HistoryMatch: React.FC<{ match: Match }> = (props) => {
  return (
    <div className="mt-6 flex h-32 w-4/5 justify-between self-center rounded-lg bg-zinc-800 p-3 text-white md:w-1/3">
      <CompetitorCard
        teamName={props.match.teamA_name}
        teamOdds={props.match.teamA_odds}
        logoUrl={props.match.teamA_logoUrl}
      />
      <div className="flex h-full w-1/3 flex-col items-center">
        <div className="mt-5 flex h-7 w-12 items-center justify-center  rounded-md bg-zinc-700 text-sm text-white">
          BO{props.match.bestOf}
        </div>
      </div>
      <CompetitorCard
        teamName={props.match.teamB_name}
        teamOdds={props.match.teamB_odds}
        logoUrl={props.match.teamB_logoUrl}
      />
    </div>
  );
};
