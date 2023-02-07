import { Match } from "@prisma/client";
import CountdownTimer from "./CountdownTimer";

const DailyMatchComponent: React.FC<{ match: Match }> = (props) => {
  return (
    <div className="grid h-48 grid-cols-5 gap-3 bg-gray-700 text-white">
      <div className="row-span-2 h-20 w-20 justify-self-end bg-gray-100"></div>
      <div>{props.match.teamA_name}</div>
      <div className="flex items-end justify-center">
        <div className="text-lg">starts in:</div>
      </div>
      <div className="text-right">{props.match.teamB_name}</div>
      <div className="row-span-2 h-20 w-20 bg-gray-100"></div>
      <div className="text-left">{props.match.teamA_odds.toString()}</div>
      <div className="flex items-start justify-center">
        <CountdownTimer targetDate={props.match.dateAndTime}></CountdownTimer>
      </div>
      <div className="text-right">{props.match.teamB_odds.toString()}</div>
    </div>
  );
};

export default DailyMatchComponent;
