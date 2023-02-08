/* eslint-disable @next/next/no-img-element */
import { Match } from "@prisma/client";
import CountdownTimer from "./CountdownTimer";

const DailyMatchComponent: React.FC<{ match: Match }> = (props) => {
  return (
    <div className="grid h-48 grid-cols-5 gap-3 bg-gray-700 text-white">
      <div className="row-span-2 justify-self-end">
        <img
          alt="team A logo"
          width={75}
          height={75}
          src={props.match.teamA_logoUrl ?? ""}
        ></img>
      </div>
      <div>{props.match.teamA_name}</div>
      <div className="flex items-end justify-center">
        <div className="text-lg">starts in:</div>
      </div>
      <div className="text-right">{props.match.teamB_name}</div>
      <div className="row-span-2">
        <img
          alt="team B logo"
          width={75}
          height={75}
          src={props.match.teamB_logoUrl ?? ""}
        ></img>
      </div>
      <div className="text-left">{props.match.teamA_odds.toString()}</div>
      <div className="flex items-start justify-center">
        <CountdownTimer targetDate={props.match.dateAndTime}></CountdownTimer>
      </div>
      <div className="text-right">{props.match.teamB_odds.toString()}</div>
    </div>
  );
};

export default DailyMatchComponent;
