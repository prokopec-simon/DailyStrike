import { DailyMatchupData } from "../pages";
import CountdownTimer from "./CountdownTimer";

const DailyMatchComponent = ({
  teamAName,
  teamAOdds,
  teamBName,
  teamBOdds,
  matchTime,
}: DailyMatchupData) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      <div className="row-span-2 h-20 w-20 justify-self-end bg-gray-700"></div>
      <div>{teamAName}</div>
      <div className="flex items-end justify-center">
        <div className="text-lg">starts in:</div>
      </div>
      <div className="text-right">{teamBName}</div>
      <div className="row-span-2 h-20 w-20 bg-gray-700"></div>
      <div className="text-left">{teamAOdds.toString()}</div>
      <div className="flex items-start justify-center">
        <CountdownTimer EventTime={matchTime}></CountdownTimer>
      </div>
      <div className="text-right">{teamBOdds.toString()}</div>
    </div>
  );
};

export default DailyMatchComponent;
