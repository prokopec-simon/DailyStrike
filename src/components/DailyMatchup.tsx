/* eslint-disable @next/next/no-img-element */
import { Match } from "@prisma/client";
import CountdownTimer from "./CountdownTimer";

const DailyMatchComponent: React.FC<{ match: Match }> = (props) => {
  return (
    <div className="flex h-32 w-11/12 justify-between bg-zinc-800 p-2">
      <div className="flex h-full w-1/4 flex-col bg-zinc-700">
        <img
          alt="team A logo"
          className="h-1/2 p-1"
          src={props.match.teamA_logoUrl ?? ""}
        ></img>
        <div className="text-zinc-100">{props.match.teamA_name}</div>
        <div className="text-zinc-100">{props.match.teamA_odds.toString()}</div>
      </div>
      <div className="h-full w-1/3 bg-zinc-700"></div>
      <div className="h-full w-1/4 bg-zinc-700"></div>
    </div>
    // <div className="grid h-48 grid-cols-5 gap-3 bg-gray-700 text-white">
    //   <div className="row-span-2 justify-self-end">
    //     <img
    //       alt="team A logo"
    //       width={75}
    //       height={75}
    //       src={props.match.teamA_logoUrl ?? ""}
    //     ></img>
    //   </div>
    //   <div>{props.match.teamA_name}</div>
    //   <div className="flex items-end justify-center">
    //     <div className="text-lg">starts in:</div>
    //   </div>
    //   <div className="text-right">{props.match.teamB_name}</div>
    //   <div className="row-span-2">
    //     <img
    //       alt="team B logo"
    //       width={75}
    //       height={75}
    //       src={props.match.teamB_logoUrl ?? ""}
    //     ></img>
    //   </div>
    //   <div className="text-left">{props.match.teamA_odds.toString()}</div>
    //   <div className="flex items-start justify-center">
    //     <CountdownTimer targetDate={props.match.dateAndTime}></CountdownTimer>
    //   </div>
    //   <div className="text-right">{props.match.teamB_odds.toString()}</div>
    // </div>
  );
};

export default DailyMatchComponent;
