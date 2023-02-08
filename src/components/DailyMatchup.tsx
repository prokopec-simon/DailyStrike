/* eslint-disable @next/next/no-img-element */
import { Match } from "@prisma/client";
import { useState } from "react";
import CountdownTimer from "./CountdownTimer";

const DailyMatchComponent: React.FC<{ match: Match }> = (props) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  return (
    <div className="flex h-32 w-11/12 justify-between rounded-lg bg-zinc-800 p-3 text-white">
      <div
        className={`flex h-full w-1/3 cursor-pointer flex-col items-center rounded-lg bg-zinc-700 ${
          selectedTeam === props.match.teamA_name
            ? "border-2 border-solid border-orange-500"
            : ""
        }`}
        onClick={() => setSelectedTeam(props.match.teamA_name)}
      >
        <img
          alt="team A logo"
          className="h-1/2 p-1 pt-2"
          src={props.match.teamA_logoUrl ?? ""}
        ></img>
        <div className="text-lg text-zinc-100">{props.match.teamA_name}</div>
        <div className="text-sm text-zinc-100">
          {props.match.teamA_odds.toString()}
        </div>
      </div>
      <div className="flex h-full w-1/3 flex-col items-center">
        <div className="mt-5 flex h-7 w-12 items-center justify-center  rounded-md bg-zinc-700 text-sm text-white">
          BO{props.match.bestOf}
        </div>
        <div className="mt-3 text-white">
          <CountdownTimer targetDate={props.match.dateAndTime}></CountdownTimer>
        </div>
      </div>
      <div
        className={`flex h-full w-1/3 cursor-pointer flex-col items-center rounded-lg bg-zinc-700 ${
          selectedTeam === props.match.teamB_name
            ? "border-2 border-solid border-orange-500"
            : ""
        }`}
        onClick={() => setSelectedTeam(props.match.teamB_name)}
      >
        <img
          alt="team A logo"
          className="h-1/2 p-1 pt-2"
          src={props.match.teamB_logoUrl ?? ""}
        ></img>
        <div className="text-lg text-zinc-100">{props.match.teamB_name}</div>
        <div className="text-sm text-zinc-100">
          {props.match.teamB_odds.toString()}
        </div>
      </div>
    </div>
  );
};
export default DailyMatchComponent;
