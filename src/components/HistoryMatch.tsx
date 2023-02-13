/* eslint-disable @next/next/no-img-element */
import { Match } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

const TeamInfo: React.FC<{
  teamName: string;
  teamOdds: Decimal;
  logoUrl: string | null;
}> = (props) => {
  return (
    <div className="flex h-full w-1/3 flex-col items-center rounded-lg bg-zinc-700">
      <img
        alt="team logo"
        className="h-1/2 p-1 pt-2"
        src={
          props.logoUrl ??
          "https://www.hltv.org/img/static/team/placeholder.svg"
        }
      ></img>
      <div className="text-lg text-zinc-100">{props.teamName}</div>
      <div className="text-sm text-zinc-100">{props.teamOdds.toString()}</div>
    </div>
  );
};

const HistoryMatch: React.FC<{ match: Match }> = (props) => {
  return (
    <div className="mt-6 flex h-32 w-4/5 justify-between self-center rounded-lg bg-zinc-800 p-3 text-white md:w-1/3">
      <TeamInfo
        teamName={props.match.teamA_name}
        teamOdds={props.match.teamA_odds}
        logoUrl={props.match.teamA_logoUrl}
      />
      <div className="flex h-full w-1/3 flex-col items-center">
        <div className="mt-5 flex h-7 w-12 items-center justify-center  rounded-md bg-zinc-700 text-sm text-white">
          BO{props.match.bestOf}
        </div>
      </div>
      <TeamInfo
        teamName={props.match.teamB_name}
        teamOdds={props.match.teamB_odds}
        logoUrl={props.match.teamB_logoUrl}
      />
    </div>
  );
};

export default HistoryMatch;
